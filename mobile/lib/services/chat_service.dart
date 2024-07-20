import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:meddymobile/models/message.dart';

class ChatService {
  static const String baseUrl = 
    'http://trymeddy.com/api';
      // 'http://localhost:8000/api';
  
  Future<List<Message>> getChatHistory() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/chat'), headers: {
        "idToken": "dev",
      });
      List<dynamic> chatHistory = jsonDecode(response.body)['chatHistory'];
      return chatHistory.map((message) => Message.fromJson(message)).toList();
    } catch (e) {
      print(e.toString());
      return List.empty();
    }
  }
}
