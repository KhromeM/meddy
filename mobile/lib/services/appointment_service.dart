import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'auth_service.dart';

class AppointmentService {
  final String baseUrl =
      'https://trymeddy.com/api'; // Replace with your backend URL
  final AuthService _authService = AuthService();

  // Create Appointment
  Future<Map<String, dynamic>> createAppointment({
    required String date,
    required String userId,
  }) async {
    final token = await _authService.getAuthToken();
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'date': date,
        'userId': userId,
      }),
    );
    return _handleResponse(response);
  }

  // Get All Appointments
  Future<List<dynamic>> getAllAppointments() async {
    final token = await _authService.getAuthToken();
    final response = await http.get(
      Uri.parse('$baseUrl/appointments'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
    return _handleResponse(response);
  }

  // Get Appointment by ID
  Future<Map<String, dynamic>> getAppointmentById(String appointmentId) async {
    final token = await _authService.getAuthToken();
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/$appointmentId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
    return _handleResponse(response);
  }

  // Update Appointment
  Future<Map<String, dynamic>> updateAppointment({
    required String appointmentId,
    required String date,
    required String userId,
  }) async {
    final token = await _authService.getAuthToken();
    final response = await http.put(
      Uri.parse('$baseUrl/appointments/$appointmentId'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'date': date,
        'userId': userId,
      }),
    );
    return _handleResponse(response);
  }

  // Delete Appointment
  Future<void> deleteAppointment(String appointmentId) async {
    final token = await _authService.getAuthToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/appointments/$appointmentId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
    _handleResponse(response);
  }

  // Get Appointments by Date
  Future<List<dynamic>> getAppointmentsByDate(String date) async {
    final token = await _authService.getAuthToken();
    final response = await http.get(
      Uri.parse('$baseUrl/appointments/date/$date'),
      headers: {
        'Authorization': 'Bearer $token',
      },
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

  // Parse DateTime from text
  Map<String, dynamic>? parseDateTime(String text) {
    final dateFormat = DateFormat("MMMM d, yyyy 'at' h:mm a");
    final regex = RegExp(
        r'(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\s(\d{1,2}),\s(\d{4})\s(?:at\s)?(\d{1,2}):(\d{2})\s(AM|PM)',
        caseSensitive: false);
    final match = regex.firstMatch(text);

    if (match != null) {
      final month = match.group(1);
      final day = match.group(2);
      final year = match.group(3);
      final hour = match.group(4);
      final minute = match.group(5);
      final period = match.group(6);

      final dateString = '$month $day, $year at $hour:$minute $period';
      final dateTime = dateFormat.parse(dateString);

      return {'date': dateTime};
    }
    return null;
  }
}
