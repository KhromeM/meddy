import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:meddymobile/models/message.dart';

class ChatService {
  static const String baseUrl = "http://localhost:8000/api";

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

  Future<String> postChatMessage(String text) async {
    try {
      final bodyReq = jsonEncode({"message": { "text": text,}});
      final response = await http.post(Uri.parse('$baseUrl/chat'), headers: {
        "Content-Type": "application/json",
        "idToken": "dev",
      }, body: bodyReq);
      return jsonDecode(response.body)['text'];
    } catch (e) {
      print(e.toString());
      return "";
    }
  }

  Future<void> postChatMessageStream() async {
    print("postChatMessageStream");
  }
}