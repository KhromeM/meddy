import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:meddymobile/models/message.dart';
import 'package:path/path.dart' as path;
import 'package:meddymobile/services/auth_service.dart';

class ChatService {
  static const String baseUrl = 'https://trymeddy.com/api';
  // static const String baseUrl = 'http://localhost:8000/api';
  final AuthService _authService = AuthService();
  String? userId; // Class-level userId

  ChatService() {
    _initializeUserId();
  }

  Future<void> _initializeUserId() async {
    userId = await _authService.getIdToken(); // Fetch userId and store it
  }

  Future<List<Message>> getChatHistory() async {
    if (userId == null) {
      userId =
          await _authService.getIdToken(); // Fetch idToken if not already done
      if (userId == null) {
        throw Exception('User not authenticated');
      }
    }
    try {
      final response = await http.get(Uri.parse('$baseUrl/chat'), headers: {
        "idToken": userId!,
      });
      return (jsonDecode(response.body)['chatHistory'] as List)
          .map((message) => Message.fromJson(message))
          .toList();
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
        'idToken': userId!,
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
          'idToken': userId!,
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
