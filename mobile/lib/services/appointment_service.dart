import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:meddymobile/services/auth_service.dart'; // Import AuthService

class AppointmentService {
  final String baseUrl = 'https://trymeddy.com/api';
  final AuthService _authService = AuthService(); // Initialize AuthService
  late final Future<String> _userId;

  // Constructor to initialize userId
  AppointmentService() {
    _userId = _initializeUserId();
  }

  Future<String> _initializeUserId() async {
    final String? userId = await _authService.getIdToken();
    if (userId == null || userId.isEmpty) {
      throw Exception('User ID token is null or empty');
    }
    return userId;
  }

  // Create Appointment
  Future<Map<String, dynamic>> createAppointment({
    required String date,
    String? transcript,
    String? transcriptSummary,
    String? description,
  }) async {
    final String userId = await _userId;
    final response = await http.post(
      Uri.parse('$baseUrl/info/reminder'),
      headers: {'Content-Type': 'application/json', 'idToken': userId},
      body: jsonEncode({
        'date': date,
        'transcript': transcript,
        'transcriptSummary': transcriptSummary,
        'description': description,
        'userId': userId,
      }),
    );
    return _handleResponse(response);
  }

  // Get All Appointments
  Future<Map<String, dynamic>> getAllAppointments() async {
    final String userId = await _userId;
    final response = await http.get(
      Uri.parse('$baseUrl/info/reminder'),
      headers: {'idToken': userId},
    );
    return _handleResponse(response);
  }

  // Get Appointment by ID
  Future<Map<String, dynamic>> getAppointmentById(String appointmentId) async {
    final String userId = await _userId;
    final response = await http.get(
      Uri.parse('$baseUrl/appointment/$appointmentId'),
      headers: {'idToken': userId},
    );
    return _handleResponse(response);
  }

  // Insert Transcript
  Future<Map<String, dynamic>> insertTranscript({
    required String appointmentId,
    required String transcript,
    String? transcriptSummary,
  }) async {
    final String userId = await _userId;
    final response = await http.put(
      Uri.parse('$baseUrl/appointment/$appointmentId/transcript'),
      headers: {
        'Content-Type': 'application/json',
        'idToken': userId,
      },
      body: jsonEncode({
        'transcript': transcript,
        'transcriptSummary': transcriptSummary,
      }),
    );
    return _handleResponse(response);
  }

  // Update Appointment
  Future<Map<String, dynamic>> updateAppointment({
    required String appointmentId,
    required String date,
    String? transcript,
    String? transcriptSummary,
    String? description,
    required String doctorId,
  }) async {
    final String userId = await _userId;
    final response = await http.put(
      Uri.parse('$baseUrl/appointment/$appointmentId'),
      headers: {'Content-Type': 'application/json', 'idToken': userId},
      body: jsonEncode({
        'date': date,
        'transcript': transcript,
        'transcriptSummary': transcriptSummary,
        'description': description,
        'userId': userId,
        'doctorId': doctorId,
      }),
    );
    return _handleResponse(response);
  }

  // Delete Appointment
  Future<void> deleteAppointment(String appointmentId) async {
    final String userId = await _userId;
    final response = await http.delete(
      Uri.parse('$baseUrl/appointment/$appointmentId'),
      headers: {'idToken': userId},
    );
    _handleResponse(response);
  }

  // Get Appointments by Date
  Future<List<dynamic>> getAppointmentsByDate(String date) async {
    final String userId = await _userId;
    final response = await http.get(
      Uri.parse('$baseUrl/appointment/date/$date'),
      headers: {'idToken': userId},
    );
    return _handleResponse(response);
  }

  // Handle HTTP response
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load data: ${response.statusCode}');
    }
  }
}
