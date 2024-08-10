import 'package:flutter/material.dart';
import 'package:meddymobile/models/fitness_data.dart';
import 'package:meddymobile/models/health_category.dart';
import 'package:meddymobile/services/health_service.dart';
import 'package:meddymobile/widgets/health_summary_card.dart';
import 'package:meddymobile/widgets/fitness_card.dart';

class HealthPage extends StatefulWidget {
  @override
  _HealthPageState createState() => _HealthPageState();
}

class _HealthPageState extends State<HealthPage> {
  bool showActivityStatus = false;
  final HealthService healthService = HealthService();
  MedicalRecord? _medicalRecord;
  HealthData? _fitnessData;

  @override
  void initState() {
    super.initState();
    _loadMedicalRecord();
    _loadActivitiyData();
  }

  Future<void> _loadMedicalRecord() async {
    try {
      final medicalRecord = await healthService.fetchMedicalRecord();
      if (!mounted) return;
      setState(() {
        _medicalRecord = medicalRecord;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        print("Error loading medical records");
      });
    }
  }

  Future<void> _loadActivitiyData() async {
    try {
      final fitnessData = await healthService.fetchGFitData();
      if (!mounted) return;
      setState(() {
        _fitnessData = fitnessData;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        print("Error loading fitness records");
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            forceMaterialTransparency: true,
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              showActivityStatus = false;
                            });
                          },
                          child: Column(
                            children: [
                              Text(
                                'Summary',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: !showActivityStatus
                                      ? Color.fromARGB(255, 0, 0, 0)
                                      : Colors.black,
                                ),
                              ),
                              SizedBox(height: 4),
                              Container(
                                height: 2,
                                width: 60,
                                color: !showActivityStatus
                                    ? Color.fromARGB(255, 0, 0, 0)
                                    : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                        SizedBox(width: 16),
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              showActivityStatus = true;
                            });
                          },
                          child: Column(
                            children: [
                              Text(
                                'Activity',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: showActivityStatus
                                      ? Color.fromARGB(255, 0, 0, 0)
                                      : Colors.black,
                                ),
                              ),
                              SizedBox(height: 4),
                              Container(
                                height: 2,
                                width: 60,
                                color: showActivityStatus
                                    ? Color.fromARGB(255, 0, 0, 0)
                                    : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          body: _fitnessData == null || _medicalRecord == null
              ? Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          showActivityStatus
                              ? 'Health Activity'
                              : 'Health Summary',
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 16),
                        showActivityStatus
                            ? FitnessCard(fitnessData: _fitnessData!)
                            : HealthSummaryCard(medicalRecord: _medicalRecord!),
                      ],
                    ),
                  ),
                ),
        ),
      ],
    );
  }
}
