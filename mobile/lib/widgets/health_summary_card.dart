import 'package:flutter/material.dart';
import 'package:meddymobile/models/health_category.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:skeletonizer/skeletonizer.dart';

class HealthSummaryCard extends StatelessWidget {
  final MedicalRecord? medicalRecord;

  HealthSummaryCard({required this.medicalRecord});

  Color _getScoreColor(int? score, bool isHighContrast) {
    if (score == null) return isHighContrast ? Colors.white : Colors.grey;
    if (score >= 80) return isHighContrast ? Colors.green : Colors.green;
    if (score >= 60) return isHighContrast ? Colors.yellow : Colors.yellow;
    return isHighContrast ? Colors.red : Colors.red;
  }

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    final healthDetails = medicalRecord == null
        ? List.generate(
            7,
            (_) => HealthDetail(
                name: 'Loading...',
                oneLineSummary: 'Loading...',
                generalRecommendation: 'Loading...',
                actionPlan: ActionPlan(longTerm: [], shortTerm: []),
                details: Details(
                    goldTest: TestDetail(
                        name: '', range: '', recommendation: '', result: ''),
                    secondaryTests: [])))
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
                color: isHighContrast
                    ? Colors.black
                    : Color.fromRGBO(254, 249, 239, 0.7),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isHighContrast
                      ? Colors.white
                      : Colors.black.withOpacity(0.1),
                  width: 1,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Theme(
                  data: Theme.of(context)
                      .copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    tilePadding: EdgeInsets.all(0),
                    childrenPadding:
                        EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
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
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: isHighContrast
                                  ? 22
                                  : 18, // Adjust size for high contrast
                              color:
                                  isHighContrast ? Colors.white : Colors.black,
                            ),
                          ),
                          progressColor:
                              _getScoreColor(detail.score, isHighContrast),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                detail.name,
                                style: TextStyle(
                                  fontSize: isHighContrast
                                      ? 20
                                      : 18, // Adjust size for high contrast
                                  fontWeight: FontWeight.bold,
                                  color: isHighContrast
                                      ? Colors.white
                                      : Colors.black,
                                ),
                              ),
                              SizedBox(height: 8),
                              Text(
                                detail.oneLineSummary,
                                style: TextStyle(
                                  fontSize: isHighContrast
                                      ? 16
                                      : 14, // Adjust size for high contrast
                                  color: isHighContrast
                                      ? Colors.white
                                      : Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    children: <Widget>[
                      Divider(
                        color: isHighContrast ? Colors.white : Colors.black,
                      ),
                      _buildSectionTitle(
                          'Gold Test', Icons.star, isHighContrast),
                      _buildTestDetail(
                          'Name', detail.details.goldTest.name, isHighContrast),
                      _buildTestDetail('Result', detail.details.goldTest.result,
                          isHighContrast),
                      _buildTestDetail('Range', detail.details.goldTest.range,
                          isHighContrast),
                      SizedBox(height: 16),
                      _buildSectionTitle(
                          'Secondary Tests', Icons.science, isHighContrast),
                      ...detail.details.secondaryTests
                          .map((test) => Column(
                                children: [
                                  _buildTestDetail(
                                      'Test', test.name, isHighContrast),
                                  _buildTestDetail(
                                      'Result', test.result, isHighContrast),
                                  _buildTestDetail(
                                      'Range', test.range, isHighContrast),
                                  SizedBox(height: 8),
                                ],
                              ))
                          .toList(),
                      SizedBox(height: 16),
                      _buildSectionTitle('General Recommendation',
                          Icons.recommend, isHighContrast),
                      Text(
                        detail.generalRecommendation,
                        style: TextStyle(
                          fontSize: isHighContrast
                              ? 18
                              : 16, // Adjust size for high contrast
                          color: isHighContrast ? Colors.white : Colors.black,
                        ),
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

  Widget _buildTestDetail(String label, String value, bool isHighContrast) {
    return Padding(
      padding: const EdgeInsets.only(top: 4.0, bottom: 4.0),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: TextStyle(
              fontSize:
                  isHighContrast ? 18 : 16, // Adjust size for high contrast
              fontWeight: FontWeight.bold,
              color: isHighContrast ? Colors.white : Colors.black,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize:
                    isHighContrast ? 18 : 16, // Adjust size for high contrast
                color: isHighContrast ? Colors.white : Colors.black,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon, bool isHighContrast) {
    return Row(
      children: [
        Icon(icon,
            size: isHighContrast ? 24 : 20, // Adjust size for high contrast
            color: isHighContrast ? Colors.white : Colors.blueAccent),
        SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            fontSize: isHighContrast ? 18 : 16, // Adjust size for high contrast
            fontWeight: FontWeight.bold,
            color: isHighContrast ? Colors.white : Colors.black,
          ),
        ),
      ],
    );
  }
}
