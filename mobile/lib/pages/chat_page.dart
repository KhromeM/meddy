import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/audio_service.dart';

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
  late AudioService _audioService;
  bool _isTyping = false;
  bool _isRecording = false;
  bool _isLoading = true;

  String _currentMessageChunk = "";
  int? _currentMessageId;

  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    ws.connect();
    _audioService = AudioService(ws);
    ws.setHandler("audio", (message) {
      print('Got audio! ${message.length}');
    });
    ws.setHandler("chat_response", (message) {
      _handleChatResponse(message);
    });

    _textEditingController.addListener(() {
      setState(() {
        _isTyping = _textEditingController.text.isNotEmpty;
      });
    });
    _loadChatHistory();
    _scrollToBottom();
  }

  Future<void> _loadChatHistory() async {
    try {
      List<Message> chatHistory = await _chatService.getChatHistory();
      setState(() {
        _chatHistory = chatHistory;
        _isLoading = false;
      });
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
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
        messageId: _chatHistory.length + 1,
        userId: "DEVELOPER",
        source: source,
        text: text,
        time: DateTime.now(),
      ));
      if (temporary) {
        _currentMessageId = messageId;
      }
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
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
        String text = _textEditingController.text;
        _addMessageToChatHistory("user", _textEditingController.text);
        _textEditingController.clear();
        ws.sendMessage({
          'type': 'chat',
          'data': {'text': text},
        });
      } catch (e) {
        print('Failed to send message: $e');
      }
    }
  }

  void _updateCurrentMessageChunk(String chunk) {
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
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  void _handleChatResponse(dynamic message) {
    if (message['type'] == 'chat_response') {
      setState(() {
        _currentMessageChunk += message['data'];
        if (_currentMessageChunk.isNotEmpty && _currentMessageId == null) {
          _addMessageToChatHistory("llm", _currentMessageChunk,
              temporary: true);
        } else {
          _updateCurrentMessageChunk(_currentMessageChunk);
        }
        if (message['isComplete']) {
          _currentMessageId = null;
          _currentMessageChunk = "";
        }
      });
    }
  }

  void _toggleAudio() async {
    // Logic to start listening to user's voice input (Left as placeholder)
    _isRecording = await _audioService.toggleRecording();
    setState(() {
      print('Audio Mode: $_isRecording');
    });
    // Example of functionality: Implement speech-to-text or voice recognition
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
                          subtitle: Text(message.text),
                        );
                      },
                    )),
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
