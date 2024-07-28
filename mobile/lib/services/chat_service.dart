import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:meddymobile/models/message.dart';
import 'package:path/path.dart' as path;

class ChatService {
  static const String baseUrl = 'https://trymeddy.com/api';
  // 'http://localhost:8000/api';

  Future<List<Message>> getChatHistory() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/chat'), headers: {
        "idToken": "dev",
      });
      List<dynamic> chatHistory = jsonDecode(response.body)['chatHistory'];
      print("Parsing messages..");
      var messages =
          chatHistory.map((message) => Message.fromJson(message)).toList();
      print("MESSAGES: ");
      print(messages);
      return messages;
    } catch (e) {
      print(e.toString());
      return List.empty();
    }
  }

  Future<void> uploadImage(String image) async {
    final bytes = await File(image).readAsBytes();
    final base64Image = base64Encode(bytes);
    final response = await http.post(
      Uri.parse('$baseUrl/image'),
      headers: {
        'Content-Type': 'application/json',
        'idToken': 'dev',
      },
      body: jsonEncode({
        'image': {
          'name': path.basename(image),
          'data': base64Image,
        },
      }),
    );
    print("Uploading status ${response.statusCode}");
    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      print("Uploaded $responseData");
    } else {
      print('Error uploading image: ${response.body}');
    }
  }

  Future<Uint8List?> fetchImage(String imageId) async {
    try {
      final uri = Uri.parse('$baseUrl/image').replace(queryParameters: {
        'image': imageId,
      });

      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'idToken': 'dev',
        },
      );

      if (response.statusCode == 200) {
        return response.bodyBytes;
      } else {
        print('Error fetching image: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Failed to fetch image: $e');
      return null;
    }
  }
}
