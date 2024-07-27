import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:meddymobile/models/message.dart';

class ChatService {
  static const String baseUrl = 'http://trymeddy.com/api';
  // 'http://localhost:8000/api';

  Future<List<Message>> getChatHistory() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/chat'), headers: {
        "idToken": "dev",
      });
      List<dynamic> chatHistory =
          jsonDecode(response.body)['chatHistory'];
      print("Parsing messages..");
      var messages = chatHistory
          .map((message) => Message.fromJson(message))
          .toList();
      print("MESSAGES: ");
      print(messages);
      return messages;
    } catch (e) {
      print(e.toString());
      return List.empty();
    }
  }
}
