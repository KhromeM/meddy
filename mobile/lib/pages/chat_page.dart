import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:meddymobile/widgets/animated_stop_button.dart'; // Import the AnimatedStopButton
import 'dart:async';

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

  bool _isTyping = false;
  bool _isRecording = false;
  bool _isLoading = true;
  bool _isGenerating = false;

  String _currentMessageChunk = "";
  int? _currentMessageId;
  Timer? _debounceTimer;
  Timer? _completionTimer;
  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    ws.connect();
    _recorderService = RecorderService(ws);
    _playerService = PlayerService(ws);

    ws.setHandler("chat_response", (message) {
      _handleChatResponse(message);
    });

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
    } catch (e) {
      print('Failed to load chat history: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _addMessageToChatHistory(String source, String text,
      {bool temporary = false}) {
    setState(() {
      int messageId = _chatHistory.length + 1;
      _chatHistory.add(Message(
        messageId: messageId,
        userId: "DEVELOPER",
        source: source,
        text: text,
        time: DateTime.now(),
      ));
      if (temporary) {
        _currentMessageId = messageId;
      }
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 300),
        curve: Curves.easeOut,
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
        setState(() {
          _isGenerating = true;
        });
      } catch (e) {
        print('Failed to send message: $e');
      }
    }
  }

  void _updateCurrentMessageChunk(String chunk) {
    if (_debounceTimer?.isActive ?? false) {
      _debounceTimer?.cancel();
    }

    setState(() {
      if (_currentMessageId != null) {
        int index = _chatHistory
            .indexWhere((msg) => msg.messageId == _currentMessageId);
        if (index != -1) {
          _chatHistory[index] = Message(
            messageId: _currentMessageId!,
            userId: "DEVELOPER",
            source: "llm",
            text: chunk,
            time: DateTime.now(),
          );
        }
      }
    });
    _debounceTimer = Timer(Duration(milliseconds: 80), () {
      _scrollToBottom();
    });
    _completionTimer?.cancel();
    _completionTimer = Timer(Duration(seconds: 1), () {
      _finishMessageGeneration();
    });
  }

  void _handleChatResponse(dynamic message) {
    if (message['type'] == 'chat_response') {
      setState(() {
        if (_currentMessageId == null) {
          _currentMessageChunk = message['data'];
          _addMessageToChatHistory("llm", _currentMessageChunk,
              temporary: true);
          _isGenerating = true;
        } else if (_isGenerating) {
          _currentMessageChunk += message['data'];
          _updateCurrentMessageChunk(_currentMessageChunk);
        }
      });
    }
  }

  void _finishMessageGeneration() {
    setState(() {
      _currentMessageId = null;
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
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : ListView.builder(
                    controller: _scrollController,
                    itemCount: _chatHistory.length,
                    itemBuilder: (context, index) {
                      final message = _chatHistory[index];
                      return ListTile(
                        title: Text(message.source),
                        subtitle: MarkdownBody(
                          data: message.text,
                        ),
                      );
                    },
                  ),
          ),
          if (_isGenerating)
            AnimatedStopButton(
              onPressed: _stopGenerationVisually,
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
            ),
          )
        ],
      ),
    );
  }
}
