import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'dart:async';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  WSConnection ws = WSConnection(); // add handler for chat and audio
  TextEditingController _textEditingController = TextEditingController();
  final ChatService _chatService = ChatService();
  List<Message> _chatHistory = [];
  late RecorderService _recorderService;
  late PlayerService _playerService;

  bool _isTyping = false;
  bool _isRecording = false;
  bool _isLoading = true;

  String _currentMessageChunk = "";
  bool _buildingMessage = false;
  Timer? _debounceTimer;
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
  }

  Future<void> _loadChatHistory() async {
    try {
      List<Message> chatHistory = await _chatService.getChatHistory();
      setState(() {
        _chatHistory = List.from(chatHistory);
        _isLoading = false;
      });

      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToBottom();
      });
    } catch (e) {
      print('Failed to load chat history: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  // adds new message to chat history, only called once per message
  void _addMessageToChatHistory(String source, String text) {
    setState(() {
      _buildingMessage = true;
      _chatHistory.add(Message(
        messageId: _chatHistory.length + 1, // change to uuid
        userId: "DEVELOPER",
        source: source,
        text: text,
        time: DateTime.now(),
      ));
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

// updates the current message thats being formed
  void _updateCurrentMessageChunk(String text, String source) {
    if (_debounceTimer?.isActive ?? false) {
      _debounceTimer?.cancel();
    }
    setState(() {
      _chatHistory.removeLast();
      _chatHistory.add(Message(
        messageId: _chatHistory.length + 1, // change to uuid
        userId: "DEVELOPER",
        source: source,
        text: text,
        time: DateTime.now(),
      ));
      // }
    });
    _debounceTimer = Timer(Duration(milliseconds: 80), () {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToBottom();
      });
    });
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 300),
        curve: Curves.elasticInOut,
      );
    }
  }

  void _sendMessage() async {
    if (_textEditingController.text.isNotEmpty) {
      try {
        _addMessageToChatHistory("user", _textEditingController.text);
        print(_textEditingController.text);
        ws.sendMessage({
          'type': 'chat',
          'data': {'text': _textEditingController.text},
        });
        _textEditingController.clear();
      } catch (e) {
        print('Failed to send message: $e');
      }
    }
  }

  void _handleChatResponse(dynamic message) {
    if (message['type'] == 'chat_response') {
      print(_buildingMessage);
      print(message["data"]);
      setState(() {
        if (!_buildingMessage || _chatHistory.last.source != "llm") {
          _currentMessageChunk += message['data'];
          _addMessageToChatHistory("llm", _currentMessageChunk);
        }

        if (message['isComplete'] ?? false) {
          _buildingMessage = false;
          _currentMessageChunk = "";
        } else {
          _currentMessageChunk += message['data'];
          _updateCurrentMessageChunk(_currentMessageChunk, "llm");
        }
      });
    }
  }

  void _handleTranscription(dynamic message) {
    if (message['type'] == 'partial_transcript') {
      print(_buildingMessage);
      print(message["data"]);
      setState(() {
        if (!_buildingMessage || _chatHistory.last.source != "user") {
          _currentMessageChunk = "";
          _addMessageToChatHistory("user", _currentMessageChunk);
        }
        if (message['isComplete'] ?? false) {
          _buildingMessage = false;
          _currentMessageChunk = "";
        } else {
          _currentMessageChunk += " " + message['data'];
          _updateCurrentMessageChunk(_currentMessageChunk, "user");
        }
      });
    }
  }

  void _toggleAudio() async {
    _isRecording = await _recorderService.toggleRecording();
    if (_isRecording) {
      // recording about to end
      _playerService.playQueuedAudio();
    } else {
      // about to start recording
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
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    controller: _scrollController,
                    child: Column(
                      children: _chatHistory.map((message) {
                        return ListTile(
                          title: Text(message.source),
                          subtitle: MarkdownBody(
                            data: message.text,
                          ),
                        );
                      }).toList(),
                    ),
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
          ),
          Container(
              margin: EdgeInsets.fromLTRB(10, 10, 10, 20),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textEditingController,
                      decoration: InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 16),
                        hintText: 'Type your message...',
                        border: InputBorder.none,
                      ),
                      keyboardType: TextInputType.text,
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
              ))
        ],
      ),
    );
  }
}
