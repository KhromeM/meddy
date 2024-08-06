import 'dart:io';
import 'dart:typed_data'; // Add this import
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/providers/chat_provider.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:meddymobile/widgets/animated_stop_button.dart';
import 'package:image_picker/image_picker.dart';
import 'package:meddymobile/widgets/message_list.dart';
import 'package:path/path.dart' as path;
import 'dart:async';
import 'package:uuid/uuid.dart';
import 'package:image/image.dart' as img;
import 'package:meddymobile/widgets/listening_notifier.dart'; // Import the new widget

class ChatPage extends StatefulWidget {
  final String? initialPrompt;
  const ChatPage({super.key, this.initialPrompt});

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  WSConnection ws = WSConnection();
  TextEditingController _textEditingController = TextEditingController();
  final ChatService _chatService = ChatService();
  List<Message> _chatHistory = [];
  late RecorderService _recorderService;
  late PlayerService _playerService;
  final Uuid _uuid = Uuid();

  bool _isRecording = false;
  bool _isLoading = true;
  bool _isGenerating = false;

  Timer? _debounceTimer;
  Timer? _completionTimer;
  String? _previewImagePath;
  ScrollController _scrollController = ScrollController();
  ImagePicker _picker = ImagePicker();
  Map<String, Uint8List?> _imageCache = {};
  Map<String, List<String>> _messageBuffer = {};
  ValueNotifier<bool> _isTypingNotifier = ValueNotifier(false);
  bool _isSendingImage = false;

  Map<String, dynamic>? _messageResult;

  @override
  void initState() {
    super.initState();
    ws.connect();
    _recorderService = RecorderService(ws);
    _playerService = PlayerService(ws);

    ws.setHandler("chat_response", _handleChatResponse);
    ws.setHandler("partial_transcript", _handleTranscription);

    _textEditingController.addListener(() {
      bool isTyping = _textEditingController.text.isNotEmpty;
      if (_isTypingNotifier.value != isTyping) {
        _isTypingNotifier.value = isTyping;
      }
    });

    // Fetch chat history from ChatProvider
    _loadChatHistoryFromProvider();
    if (widget.initialPrompt != null) {
      _sendInitialPrompt(widget.initialPrompt!);
    }
    _scrollToBottom();
  }

  Future<void> _loadChatHistoryFromProvider() async {
    try {
      print('Fetching chat history from ChatProvider...');
      List<Message> chatHistory =
          Provider.of<ChatProvider>(context, listen: false).messages;
      setState(() {
        _chatHistory = List.from(chatHistory);
        _isLoading = false;
      });
      print('Chat history loaded from ChatProvider.');
      _scrollToBottom();
    } catch (e) {
      print('Failed to load chat history from ChatProvider: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<File> _resizeImage(String imagePath) async {
    final image = File(imagePath);
    final bytes = await image.readAsBytes();
    img.Image? originalImage = img.decodeImage(bytes);
    if (originalImage == null) return image;

    img.Image resizedImage = img.copyResize(originalImage, width: 800);
    final resizedBytes = img.encodeJpg(resizedImage);
    final resizedFile = File('${image.path}_resized.jpg')
      ..writeAsBytesSync(resizedBytes);

    return resizedFile;
  }

  Future<void> _selectImageFromCamera() async {
    final image = await _picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      final resizedImage = await _resizeImage(image.path);
      setState(() {
        _previewImagePath = resizedImage.path;
      });
    }
  }

  Future<void> _selectImageFromGallery() async {
    final image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      final resizedImage = await _resizeImage(image.path);
      setState(() {
        _previewImagePath = resizedImage.path;
      });
    }
  }

  Future<Uint8List?> _fetchImage(String imageID) async {
    if (_imageCache.containsKey(imageID)) {
      return _imageCache[imageID];
    }
    Uint8List? imageData = await _chatService.fetchImage(imageID);
    _imageCache[imageID] = imageData;
    _scrollToBottom();
    return imageData;
  }

  void _addMessageToChatHistory(String source, String text, String reqId,
      {String? imageID, Map<String, dynamic>? result}) {
    Message newMessage = Message(
      messageId: reqId,
      userId: "DEVELOPER",
      source: source,
      imageID: imageID,
      text: text,
      time: DateTime.now(),
      result: result,
    );
    Provider.of<ChatProvider>(context, listen: false).addMessage(newMessage);
    setState(() {
      _chatHistory.add(newMessage);
    });

    _scrollToBottom();
  }

  void _updateCurrentMessageChunk(String text, String reqId,
      {Map<String, dynamic>? result}) {
    Provider.of<ChatProvider>(context, listen: false)
        .updateMessage(reqId, text, result: result);
    int index = _chatHistory.indexWhere((msg) => msg.messageId == reqId);
    if (index == -1) return;

    setState(() {
      _chatHistory[index] =
          _chatHistory[index].copyWith(text: text, result: result);
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    if (_debounceTimer?.isActive ?? false) _debounceTimer!.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        final position = _scrollController.position.maxScrollExtent;
        _scrollController.animateTo(
          position,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    if (_isSendingImage) return;

    final String reqId = _uuid.v4();
    String text = _textEditingController.text.isEmpty
        ? "describe this image"
        : _textEditingController.text;

    if (_textEditingController.text.isNotEmpty || _previewImagePath != null) {
      try {
        if (_previewImagePath != null) {
          setState(() {
            _isSendingImage = true;
          });
          String imageBaseName = path.basename(_previewImagePath!);
          await _chatService.uploadImage(_previewImagePath!);

          _addMessageToChatHistory("user", text, reqId + "_user",
              imageID: imageBaseName);
          ws.sendMessage({
            'type': 'chat',
            'data': {'text': text, 'image': imageBaseName, 'reqId': reqId}
          });
        } else {
          _addMessageToChatHistory(
              "user", _textEditingController.text, reqId + "_user");
          ws.sendMessage({
            'type': 'chat',
            'data': {'text': _textEditingController.text, 'reqId': reqId},
          });
        }

        _textEditingController.clear();

        setState(() {
          _previewImagePath = null;
          _isGenerating = true;
          _isSendingImage = false;
        });
      } catch (e) {
        print('Failed to send message: $e');
        setState(() {
          _isSendingImage = false;
        });
      }
    }
  }

  void _handleChatResponse(dynamic message) {
    final String reqId = message["reqId"] + "_llm";
    final String text = message['data'];
    final Map<String, dynamic>? result = message['result'];

    if (result != null) {
      _messageResult = result;
    }
    setState(() {
      if (!_messageBuffer.containsKey(reqId)) {
        _messageBuffer[reqId] = [];
        _addMessageToChatHistory("llm", "", reqId, result: _messageResult);
      }
      _messageBuffer[reqId]!.add(text);

      String fullMessage = _messageBuffer[reqId]!.join("");
      _updateCurrentMessageChunk(fullMessage, reqId, result: _messageResult);

      if (message['isComplete'] ?? false) {
        _messageBuffer.remove(reqId);
        _isGenerating = false;
        _messageResult = null;
      }
    });
  }

  void _handleTranscription(dynamic message) {
    final String reqId = message["reqId"] + "_user";
    final String text = message['data'];

    setState(() {
      if (!_messageBuffer.containsKey(reqId)) {
        _messageBuffer[reqId] = [];
        _addMessageToChatHistory("user", "", reqId);
      }
      _messageBuffer[reqId]!.add(text);

      if (message['isComplete'] ?? false) {
        _messageBuffer.remove(reqId);
        return;
      }
      String fullMessage = _messageBuffer[reqId]!.join(" ");
      _updateCurrentMessageChunk(
        fullMessage,
        reqId,
      );
    });

    _scrollToBottom();
  }

  void _stopGenerationVisually() {
    _completionTimer?.cancel();
    setState(() {
      _isGenerating = false;
    });
  }

  void _sendInitialPrompt(String prompt) {
    _textEditingController.text = prompt;
    _sendMessage();
  }

  void _toggleAudio() async {
    if (_isRecording) {
      await _recorderService.toggleRecording();
      setState(() {
        _isRecording = false;
      });
      _playerService.playQueuedAudio();
    } else {
      bool isRecording = await _recorderService.toggleRecording();
      setState(() {
        _isRecording = isRecording;
        if (_isRecording) {
          _textEditingController.clear(); // Clear text when starting recording
        }
      });
      if (!_isRecording) {
        _playerService.stopPlayback();
      }
    }
  }

  @override
  void dispose() {
    _recorderService.dispose();
    _playerService.dispose();
    _scrollController.dispose();
    _debounceTimer?.cancel();
    _completionTimer?.cancel();
    _textEditingController.dispose();
    _isTypingNotifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        forceMaterialTransparency: true,
        elevation: 0,
      ),
      body: Stack(
        children: [
          Column(
            children: [
              Expanded(
                child: Stack(
                  children: [
                    _isLoading
                        ? Center(child: CircularProgressIndicator())
                        : MessageList(
                            messages: _chatHistory,
                            scrollController: _scrollController,
                            fetchImage: _fetchImage,
                          ),
                    if (_isGenerating)
                      Positioned(
                        bottom: 0,
                        left: 12,
                        child: AnimatedStopButton(
                          onPressed: _stopGenerationVisually,
                        ),
                      ),
                    if (_isRecording)
                      ListeningNotifier(), // Show the ListeningNotifier when recording
                  ],
                ),
              ),
              Container(
                margin: EdgeInsets.fromLTRB(10, 10, 10, 20),
                child: Stack(
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.black),
                      ),
                      child: Column(
                        children: [
                          if (_previewImagePath != null)
                            Stack(
                              children: [
                                Container(
                                  margin: EdgeInsets.only(bottom: 8),
                                  child: GestureDetector(
                                    onTap: () {
                                      showDialog(
                                        context: context,
                                        builder: (BuildContext context) {
                                          return Dialog(
                                            child: ConstrainedBox(
                                              constraints: BoxConstraints(
                                                maxWidth: MediaQuery.of(context)
                                                        .size
                                                        .width *
                                                    0.8,
                                                maxHeight:
                                                    MediaQuery.of(context)
                                                            .size
                                                            .height *
                                                        0.8,
                                              ),
                                              child: SingleChildScrollView(
                                                child: Column(
                                                  mainAxisSize:
                                                      MainAxisSize.min,
                                                  children: [
                                                    ClipRRect(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              16.0),
                                                      child: Image.file(
                                                        File(
                                                            _previewImagePath!),
                                                        fit: BoxFit.contain,
                                                      ),
                                                    )
                                                  ],
                                                ),
                                              ),
                                            ),
                                          );
                                        },
                                      );
                                    },
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(16.0),
                                      child: Image.file(
                                        File(_previewImagePath!),
                                        width: 100,
                                        height: 130,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  top: 5,
                                  right: 5,
                                  child: InkWell(
                                    onTap: () {
                                      setState(() {
                                        _previewImagePath = null;
                                      });
                                    },
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: Colors.black54,
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        Icons.close,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _textEditingController,
                                  maxLines: null,
                                  minLines: 1,
                                  decoration: InputDecoration(
                                    hintText: 'Type your message...',
                                    border: InputBorder.none,
                                  ),
                                  keyboardType: TextInputType.text,
                                  onSubmitted: (text) {
                                    if (text.isNotEmpty) {
                                      _sendMessage();
                                    }
                                  },
                                  enabled: !_isRecording,
                                ),
                              ),
                              IconButton(
                                icon: Icon(Icons.camera_alt_rounded),
                                color: Color.fromRGBO(0, 0, 0, 1),
                                onPressed: () {
                                  _selectImageFromCamera();
                                },
                              ),
                              IconButton(
                                icon: Icon(Icons.image),
                                color: Color.fromRGBO(0, 0, 0, 1),
                                onPressed: () {
                                  _selectImageFromGallery();
                                },
                              ),
                              ValueListenableBuilder<bool>(
                                valueListenable: _isTypingNotifier,
                                builder: (context, isTyping, child) {
                                  return _isSendingImage
                                      ? CircularProgressIndicator()
                                      : InkWell(
                                          onTap: (isTyping ||
                                                      _previewImagePath !=
                                                          null) &&
                                                  !_isRecording
                                              ? _sendMessage
                                              : _toggleAudio,
                                          child: Padding(
                                            padding: const EdgeInsets.all(8.0),
                                            child: Icon(
                                              _isRecording
                                                  ? Icons.stop
                                                  : (isTyping ||
                                                          _previewImagePath !=
                                                              null
                                                      ? Icons
                                                          .arrow_forward_ios_rounded
                                                      : Icons.mic_rounded),
                                              color:
                                                  Color.fromRGBO(0, 0, 0, 1),
                                            ),
                                          ),
                                        );
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
