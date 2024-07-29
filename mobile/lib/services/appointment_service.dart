import 'dart:convert';
import 'package:http/http.dart' as http;

class AppointmentService {
  final String baseUrl =
      'https://trymeddy.com/api'; // Replace with your backend URL

  // Create Appointment
  Future<Map<String, dynamic>> createAppointment({
    required String date,
    String? transcript,
    String? transcriptSummary,
    String? description,
    required String userId,
    required String doctorId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: {'Content-Type': 'application/json'},
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

  // Get All Appointments
  Future<List<dynamic>> getAllAppointments() async {
    final response = await http.get(Uri.parse('$baseUrl/appointments'));
    return _handleResponse(response);
  }

  // Get Appointment by ID
  Future<Map<String, dynamic>> getAppointmentById(String appointmentId) async {
    final response =
        await http.get(Uri.parse('$baseUrl/appointments/$appointmentId'));
    return _handleResponse(response);
  }

  // Insert Transcript
  Future<Map<String, dynamic>> insertTranscript({
    required String appointmentId,
    required String transcript,
    String? transcriptSummary,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/appointments/$appointmentId/transcript'),
      headers: {'Content-Type': 'application/json'},
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
    required String userId,
    required String doctorId,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/appointments/$appointmentId'),
      headers: {'Content-Type': 'application/json'},
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
    final response =
        await http.delete(Uri.parse('$baseUrl/appointments/$appointmentId'));
    _handleResponse(response);
  }

  // Get Appointments by Date
  Future<List<dynamic>> getAppointmentsByDate(String date) async {
    final response =
        await http.get(Uri.parse('$baseUrl/appointments/date/$date'));
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
