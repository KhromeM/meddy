import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:meddymobile/widgets/animated_stop_button.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;
import 'dart:typed_data';
import 'dart:async';
import 'package:uuid/uuid.dart';
import 'package:image/image.dart' as img;

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

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
    _loadChatHistory();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

  Future<void> _loadChatHistory() async {
    try {
      List<Message> chatHistory = await _chatService.getChatHistory();
      setState(() {
        _chatHistory = List.from(chatHistory);
        _isLoading = false;
      });
      _scrollToBottom();
    } catch (e) {
      print('Failed to load chat history: $e');
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
    return imageData;
  }

  void _addMessageToChatHistory(String source, String text, String reqId,
      {String? imageID}) {
    setState(() {
      _chatHistory.add(Message(
        messageId: reqId,
        userId: "DEVELOPER",
        source: source,
        imageID: imageID,
        text: text,
        time: DateTime.now(),
      ));
    });

    _scrollToBottom();
  }

  void _updateCurrentMessageChunk(String text, String reqId) {
    int index = _chatHistory.indexWhere((msg) => msg.messageId == reqId);
    if (index == -1) return;

    setState(() {
      _chatHistory[index] = _chatHistory[index].copyWith(text: text);
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    if (_isSendingImage) return;

    final String reqId = _uuid.v4();
    if (_textEditingController.text.isNotEmpty || _previewImagePath != null) {
      try {
        setState(() {
          _isSendingImage = true;
        });

        if (_previewImagePath != null) {
          String imageBaseName = path.basename(_previewImagePath!);
          await _chatService.uploadImage(_previewImagePath!);
          String text = _textEditingController.text.isEmpty
              ? "describe this image"
              : _textEditingController.text;
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

    setState(() {
      if (!_messageBuffer.containsKey(reqId)) {
        _messageBuffer[reqId] = [];
        _addMessageToChatHistory("llm", "", reqId);
      }
      _messageBuffer[reqId]!.add(text);

      String fullMessage = _messageBuffer[reqId]!.join("");
      _updateCurrentMessageChunk(fullMessage, reqId);

      if (message['isComplete'] ?? false) {
        _messageBuffer.remove(reqId);
        _isGenerating = false;
      }
    });

    _scrollToBottom();
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
      _updateCurrentMessageChunk(fullMessage, reqId);
    });

    _scrollToBottom();
  }

  void _stopGenerationVisually() {
    _completionTimer?.cancel();
    setState(() {
      _isGenerating = false;
    });
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
      body: Column(
        children: [
          Expanded(
            child: Stack(
              children: [
                _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : ListView.builder(
                        controller: _scrollController,
                        itemCount: _chatHistory.length,
                        itemBuilder: (context, index) {
                          final message = _chatHistory[index];
                          final isUser = message.source == "user";
                          return Align(
                            alignment: isUser
                                ? Alignment.centerRight
                                : Alignment.centerLeft,
                            child: Padding(
                              padding: EdgeInsets.symmetric(horizontal: 10),
                              child: Container(
                                key: ValueKey(message.messageId),
                                decoration: BoxDecoration(
                                  color: isUser
                                      ? Color.fromRGBO(255, 254, 251, 1)
                                      : Color.fromRGBO(255, 242, 228, 1),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                padding: EdgeInsets.symmetric(
                                    vertical: 10.0, horizontal: 15.0),
                                margin: EdgeInsets.symmetric(
                                    vertical: 5.0, horizontal: 10.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (message.imageID != null)
                                      FutureBuilder<Uint8List?>(
                                        future: _fetchImage(message.imageID!),
                                        builder: (context, snapshot) {
                                          if (snapshot.connectionState ==
                                              ConnectionState.waiting) {
                                            return CircularProgressIndicator();
                                          } else if (snapshot.hasError) {
                                            return Text('Error loading image');
                                          } else if (snapshot.hasData) {
                                            return Column(
                                              children: [
                                                ClipRRect(
                                                  borderRadius:
                                                      BorderRadius.circular(
                                                          16.0),
                                                  child: Image.memory(
                                                    snapshot.data!,
                                                    width: 100,
                                                    height: 130,
                                                    fit: BoxFit.cover,
                                                    gaplessPlayback: true,
                                                  ),
                                                ),
                                                SizedBox(height: 8),
                                              ],
                                            );
                                          } else {
                                            return Text('Image not available');
                                          }
                                        },
                                      ),
                                    if (message.text.isNotEmpty)
                                      MarkdownBody(data: message.text),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                if (_isGenerating)
                  Positioned(
                    bottom: 60,
                    left: 12,
                    child: AnimatedStopButton(
                      onPressed: _stopGenerationVisually,
                    ),
                  ),
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
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(16.0),
                                child: Image.file(
                                  File(_previewImagePath!),
                                  width: 100, // Full width of the container
                                  height: 130, // Adjust as needed
                                  fit: BoxFit.cover,
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
                            color: Theme.of(context).primaryColor,
                            onPressed: () {
                              _selectImageFromCamera();
                            },
                          ),
                          IconButton(
                            icon: Icon(Icons.image),
                            color: Theme.of(context).primaryColor,
                            onPressed: () {
                              _selectImageFromGallery();
                            },
                          ),
                          ValueListenableBuilder<bool>(
                            valueListenable: _isTypingNotifier,
                            builder: (context, isTyping, child) {
                              return _isSendingImage ? CircularProgressIndicator() : InkWell(
                                onTap:
                                    (isTyping || _previewImagePath != null) &&
                                            !_isRecording
                                        ? _sendMessage
                                        : _toggleAudio,
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Icon(
                                    _isRecording
                                        ? Icons.stop
                                        : (isTyping || _previewImagePath != null
                                            ? Icons.arrow_forward_ios_rounded
                                            : Icons.mic_rounded),
                                    color: Theme.of(context).primaryColor,
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
    );
  }
}
