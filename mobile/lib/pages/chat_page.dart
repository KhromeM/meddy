import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:meddymobile/widgets/animated_stop_button.dart'; // Import the AnimatedStopButton
import 'dart:async';
import 'package:uuid/uuid.dart';

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

  bool _isTyping = false;
  bool _isRecording = false;
  bool _isLoading = true;
  bool _isGenerating = false;

  String _currentMessageChunk = "";
  bool _buildingMessage = false;
  Timer? _debounceTimer;
  Timer? _completionTimer;
  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    ws.connect();
    _recorderService = RecorderService(ws);
    _playerService = PlayerService(ws);

    ws.setHandler("chat_response", _handleChatResponse);
    ws.setHandler("partial_transcript", _handleTranscription);

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

  // adds new message to chat history, only called once per message
  void _addMessageToChatHistory(String source, String text, String reqId) {
    print(reqId);
    print(source + ":  " + text);
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

// updates messages on screen based on server messages
  void _updateCurrentMessageChunk(String text, String reqId) {
    if (_debounceTimer?.isActive ?? false) {
      _debounceTimer?.cancel();
    }
    int index = _chatHistory.indexWhere((msg) => msg.messageId == reqId);
    if (index == -1) return;
    Message currMessage = _chatHistory[index];
    print(reqId);
    print(currMessage.source + ":  " + text);
    setState(() {
      _chatHistory[index] = Message(
        messageId: currMessage.messageId,
        userId: currMessage.userId,
        source: currMessage.source,
        text: text,
        time: currMessage.time,
      );
    });
    _debounceTimer = Timer(Duration(milliseconds: 80), () {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToBottom();
      });
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
        _addMessageToChatHistory(
            "user", _textEditingController.text, reqId + "_user");
        print(_textEditingController.text);
        ws.sendMessage({
          'type': 'chat',
          'data': {'text': _textEditingController.text, 'reqId': reqId},
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
    if (message['type'] == 'chat_response') {
      setState(() {
        if (!_buildingMessage || _chatHistory.last.source != "llm") {
          _currentMessageChunk += "";
          _addMessageToChatHistory(
              "llm", _currentMessageChunk, message["reqId"] + "_llm");
        }

        if (message['isComplete'] ?? false) {
          _buildingMessage = false;
          _currentMessageChunk = "";
        } else {
          _currentMessageChunk += message['data'];
          _updateCurrentMessageChunk(
              _currentMessageChunk, message["reqId"] + "_llm");
        }
      });
    }
  }

  void _handleTranscription(dynamic message) {
    if (message['type'] == 'partial_transcript') {
      setState(() {
        if (!_buildingMessage || _chatHistory.last.source != "user") {
          _currentMessageChunk = "";
          _addMessageToChatHistory(
              "user", _currentMessageChunk, message["reqId"] + "_user");
        }
        if (message['isComplete'] ?? false) {
          _buildingMessage = false;
          _currentMessageChunk = "";
        } else {
          _currentMessageChunk += " " + message['data'];
          _updateCurrentMessageChunk(
              _currentMessageChunk, message["reqId"] + "_user");
        }
      });
    }
  }

  void _finishMessageGeneration() {
    setState(() {
      _buildingMessage = false;
      _currentMessageChunk = "";
      _isGenerating = false;
    });
  }

  void _stopGenerationVisually() {
    _completionTimer?.cancel();
    setState(() {
      _isGenerating = false;
    });
  }

  void _toggleAudio() async {
    _isRecording = await _recorderService.toggleRecording();
    if (_isRecording) {
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
      appBar: AppBar(
        forceMaterialTransparency: true,
      ),
      body: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          Column(
            children: [
              Expanded(
                child: _isLoading
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
                              padding: /*  isUser
                                  ? EdgeInsets.only(right: 10)
                                  : EdgeInsets.only(left: 10), */
                                  EdgeInsets.symmetric(horizontal: 10),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: isUser
                                      ? Color.fromRGBO(255, 254, 251, 1)
                                      : Color.fromRGBO(255, 242, 228, 1),
                                  borderRadius: BorderRadius.circular(20),
                                  /* border: Border.all(
                                      width: 1,
                                      color: Color.fromRGBO(255, 184, 76, 1),
                                    ) */
                                ),
                                padding: EdgeInsets.symmetric(
                                    vertical: 10.0, horizontal: 15.0),
                                margin: EdgeInsets.symmetric(
                                    vertical: 5.0, horizontal: 10.0),
                                child: MarkdownBody(data: message.text),
                              ),
                            ),
                          );
                        },
                      ),
              ),
              /* if (_isGenerating)
                AnimatedStopButton(
                  onPressed: _stopGenerationVisually,
                ), */
              Padding(
                padding: const EdgeInsets.all(8.0),
              ),
              Container(
                margin: EdgeInsets.fromLTRB(10, 10, 10, 20),
                child: Row(
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 16),
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: 8),
                          decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.black)),
                          child: Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _textEditingController,
                                  decoration: InputDecoration(
                                    hintText: 'Type your message...',
                                    border: InputBorder.none,
                                  ),
                                  keyboardType: TextInputType.text,
                                  //added on submit
                                  onSubmitted: (text) {
                                    if (text.isNotEmpty) {
                                      _sendMessage();
                                    }
                                  },
                                ),
                              ),
                              InkWell(
                                onTap: (_isTyping && !_isRecording)
                                    ? _sendMessage
                                    : _toggleAudio,
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Icon(
                                    _isRecording
                                        ? Icons.stop
                                        : (_isTyping
                                            ? Icons.arrow_forward_ios_rounded
                                            : Icons.mic_rounded),
                                    color: Theme.of(context).primaryColor,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.image),
                      color: Theme.of(context).primaryColor,
                      onPressed: () {
                        // Handle image button press
                      },
                    ),
                  ],
                ),
              )
            ],
          ),
          if (_isGenerating)
            Positioned(
              bottom: 100,
              left: 80,
              child: AnimatedStopButton(
                onPressed: _stopGenerationVisually,
              ),
            ),
        ],
      ),
    );
  }
}
