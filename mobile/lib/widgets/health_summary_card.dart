import 'package:flutter/material.dart';
import 'package:meddymobile/models/health_category.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:skeletonizer/skeletonizer.dart';

class HealthSummaryCard extends StatelessWidget {
  final MedicalRecord? medicalRecord;

  HealthSummaryCard({required this.medicalRecord});

  Color _getScoreColor(int? score) {
    if (score == null) return Colors.grey;
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.yellow;
    return Colors.red;
  }

  @override
  Widget build(BuildContext context) {
    final healthDetails = medicalRecord == null
        ? List.generate(7, (_) => HealthDetail(
            name: 'Loading...',
            oneLineSummary: 'Loading...',
            generalRecommendation: 'Loading...',
            actionPlan: ActionPlan(longTerm: [], shortTerm: []),
            details: Details(goldTest: TestDetail(name: '', range: '', recommendation: '', result: ''), secondaryTests: [])
          ))
        : [
            medicalRecord!.metabolicHealth,
            medicalRecord!.heartHealth,
            medicalRecord!.gutHealth,
            medicalRecord!.brainHealth,
            medicalRecord!.immuneSystem,
            medicalRecord!.musculoskeletalHealth,
            medicalRecord!.hormonalProfile,
          ];

    return Column(
      children: healthDetails.map((detail) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16.0),
          child: Skeletonizer(
            enabled: medicalRecord == null,
            child: Container(
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 0.7),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.black.withOpacity(0.1),
                  width: 1,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Theme(
                  data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    tilePadding: EdgeInsets.all(0),
                    childrenPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                    maintainState: true,
                    expandedCrossAxisAlignment: CrossAxisAlignment.start,
                    collapsedBackgroundColor: Colors.transparent,
                    backgroundColor: Colors.transparent,
                    title: Row(
                      children: [
                        CircularPercentIndicator(
                          radius: 40.0,
                          lineWidth: 8.0,
                          percent: ((detail.score ?? 0) / 100).clamp(0.0, 1.0),
                          center: Text(
                            '${detail.score ?? 0}%',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          progressColor: _getScoreColor(detail.score),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                detail.name,
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              SizedBox(height: 8),
                              Text(
                                detail.oneLineSummary,
                                style: TextStyle(fontSize: 14),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    children: <Widget>[
                      Divider(),
                      _buildSectionTitle('Gold Test', Icons.star),
                      _buildTestDetail('Name', detail.details.goldTest.name),
                      _buildTestDetail('Result', detail.details.goldTest.result),
                      _buildTestDetail('Range', detail.details.goldTest.range),
                      SizedBox(height: 16),
                      _buildSectionTitle('Secondary Tests', Icons.science),
                      ...detail.details.secondaryTests.map((test) => Column(
                        children: [
                          _buildTestDetail('Test', test.name),
                          _buildTestDetail('Result', test.result),
                          _buildTestDetail('Range', test.range),
                          SizedBox(height: 8),
                        ],
                      )).toList(),
                      SizedBox(height: 16),
                      _buildSectionTitle('General Recommendation', Icons.recommend),
                      Text(
                        detail.generalRecommendation,
                        style: TextStyle(fontSize: 16),
                      ),
                      SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildTestDetail(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(top: 4.0, bottom: 4.0),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(fontSize: 16),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.blueAccent),
        SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}