import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:meddymobile/widgets/animated_stop_button.dart';
import 'dart:async';
import 'package:uuid/uuid.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  WSConnection ws = WSConnection();
  TextEditingController _textEditingController =
      TextEditingController();
  final ChatService _chatService = ChatService();
  List<Message> _chatHistory = [];
  late RecorderService _recorderService;
  late PlayerService _playerService;
  final Uuid _uuid = Uuid();

  bool _isTyping = false;
  bool _isRecording = false;
  bool _isLoading = true;
  bool _isGenerating = false;

  String _currentMessageChunk = "";
  bool _buildingMessage = false;
  Timer? _debounceTimer;
  Timer? _completionTimer;
  ScrollController _scrollController = ScrollController();
  Map<String, List<String>> _messageBuffer = {};

  @override
  void initState() {
    super.initState();
    ws.connect();
    _recorderService = RecorderService(ws);
    _playerService = PlayerService(ws);

    ws.setHandler("chat_response", _handleChatResponse);
    ws.setHandler(
        "partial_transcript", _handleTranscription);

    _textEditingController.addListener(() {
      setState(() {
        _isTyping = _textEditingController.text.isNotEmpty;
      });
    });
    _loadChatHistory();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

  Future<void> _loadChatHistory() async {
    try {
      List<Message> chatHistory =
          await _chatService.getChatHistory();
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

  void _addMessageToChatHistory(
      String source, String text, String reqId) {
    setState(() {
      _buildingMessage = true;
      _chatHistory.add(Message(
        messageId: reqId,
        userId: "DEVELOPER",
        source: source,
        text: text,
        time: DateTime.now(),
      ));
    });
    _scrollToBottom();
  }

  void _updateCurrentMessageChunk(
      String text, String reqId) {
    int index = _chatHistory
        .indexWhere((msg) => msg.messageId == reqId);
    if (index == -1) return;

    setState(() {
      _chatHistory[index] =
          _chatHistory[index].copyWith(text: text);
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

  void _sendMessage() async {
    final String reqId = _uuid.v4();
    if (_textEditingController.text.isNotEmpty) {
      try {
        _addMessageToChatHistory("user",
            _textEditingController.text, reqId + "_user");
        ws.sendMessage({
          'type': 'chat',
          'data': {
            'text': _textEditingController.text,
            'reqId': reqId
          },
        });
        _textEditingController.clear();
        setState(() {
          _isGenerating = true;
        });
      } catch (e) {
        print('Failed to send message: $e');
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
    _isRecording = await _recorderService.toggleRecording();
    if (!_isRecording) {
      _playerService.playQueuedAudio();
    } else {
      _playerService.stopPlayback();
    }

    setState(() {
      print('Audio Mode: $_isRecording');
    });
  }

  @override
  void dispose() {
    _recorderService.dispose();
    _playerService.dispose();
    _scrollController.dispose();
    _debounceTimer?.cancel();
    _completionTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: BacknavAppBar(),
      body: Column(
        children: [
          Expanded(
            child: Stack(
              children: [
                _isLoading
                    ? Center(
                        child: CircularProgressIndicator())
                    : ListView.builder(
                        controller: _scrollController,
                        itemCount: _chatHistory.length,
                        itemBuilder: (context, index) {
                          final message =
                              _chatHistory[index];
                          final isUser =
                              message.source == "user";
                          return Align(
                            alignment: isUser
                                ? Alignment.centerRight
                                : Alignment.centerLeft,
                            child: Padding(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 10),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: isUser
                                      ? Color.fromRGBO(
                                          255, 254, 251, 1)
                                      : Color.fromRGBO(
                                          255, 242, 228, 1),
                                  borderRadius:
                                      BorderRadius.circular(
                                          20),
                                ),
                                padding:
                                    EdgeInsets.symmetric(
                                        vertical: 10.0,
                                        horizontal: 15.0),
                                margin:
                                    EdgeInsets.symmetric(
                                        vertical: 5.0,
                                        horizontal: 10.0),
                                child: MarkdownBody(
                                    data: message.text),
                              ),
                            ),
                          );
                        },
                      ),
                if (_isGenerating)
                  Positioned(
                    left: 16,
                    bottom: 16,
                    child: AnimatedStopButton(
                      onPressed: _stopGenerationVisually,
                    ),
                  ),
              ],
            ),
          ),
          Container(
            margin: EdgeInsets.fromLTRB(10, 10, 10, 20),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius:
                          BorderRadius.circular(20),
                      border:
                          Border.all(color: Colors.black),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller:
                                _textEditingController,
                            decoration: InputDecoration(
                              hintText:
                                  'Type your message...',
                              border: InputBorder.none,
                            ),
                            keyboardType:
                                TextInputType.text,
                            onSubmitted: (text) {
                              if (text.isNotEmpty) {
                                _sendMessage();
                              }
                            },
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.image),
                          color: Theme.of(context)
                              .primaryColor,
                          onPressed: () {
                            // Handle image button press
                          },
                        ),
                        InkWell(
                          onTap:
                              (_isTyping && !_isRecording)
                                  ? _sendMessage
                                  : _toggleAudio,
                          child: Padding(
                            padding:
                                const EdgeInsets.all(8.0),
                            child: Icon(
                              _isRecording
                                  ? Icons.stop
                                  : (_isTyping
                                      ? Icons
                                          .arrow_forward_ios_rounded
                                      : Icons.mic_rounded),
                              color: Theme.of(context)
                                  .primaryColor,
                            ),
                          ),
                        ),
                      ],
                    ),
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
