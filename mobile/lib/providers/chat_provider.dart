import 'package:flutter/material.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/services/chat_service.dart';

class ChatProvider with ChangeNotifier {
  final ChatService _chatService = ChatService();
  List<Message> _messages = [];
  bool _isLoading = true;

  List<Message> get messages => _messages;
  bool get isLoading => _isLoading;

  Future<void> loadChatHistory() async {
    try {
      List<Message> chatHistory = await _chatService.getChatHistory();
      _messages = chatHistory;
    } catch (e) {
      print('Failed to load chat history: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void addMessage(Message message) {
    _messages.add(message);
    notifyListeners();
  }

  void updateMessage(String messageId, String text) {
    int index = _messages.indexWhere((msg) => msg.messageId == messageId);
    if (index != -1) {
      _messages[index] = _messages[index].copyWith(text: text);
      notifyListeners();
    }
  }
}
