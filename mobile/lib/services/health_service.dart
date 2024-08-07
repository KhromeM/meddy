import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:meddymobile/models/health_category.dart';
import 'package:meddymobile/models/fitness_data.dart';

class HealthService {
  static const String baseUrl = 'https://trymeddy.com/api';

  Future<MedicalRecord> fetchMedicalRecord() async {
    final response = await http.get(Uri.parse('$baseUrl/medical-record'), headers: {
      'Content-Type': 'application/json',
      "idToken": "dev",
    });

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final record = MedicalRecord.fromJson(body);
      return record;
    } else {
      throw Exception('Failed to load medical record');
    }
  }

  Future<HealthData> fetchGFitData() async {
    final response = await http.get(Uri.parse('$baseUrl/gfit'), headers: {
      'Content-Type': 'application/json',
      "idToken": "dev",
    });

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final healthData = HealthData.fromJson(body);      
      return healthData;
    } else {
      throw Exception('Failed to load Google Fit data');
    }
  }
}
