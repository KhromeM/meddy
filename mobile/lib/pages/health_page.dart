import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:meddymobile/models/health_category.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';

List<HealthCategory> healthCategories = [
  HealthCategory(
    name: 'Metabolic Health',
    score: 85,
    oneLineSummary:
        "Your metabolic health is good, but there's room for improvement.",
    goldTest: 'HbA1c',
    result: '5.2%',
    range: '4.0% - 5.6%',
    recommendation:
        "Consider incorporating more whole grains and reducing processed sugar intake to further improve your metabolic health.",
  ),
  HealthCategory(
    name: 'Heart Health',
    score: 50,
    oneLineSummary: 'Your heart health is excellent. Keep up the good work!',
    goldTest: 'Coronary Calcium Score',
    result: '0',
    range: '0 - 10',
    recommendation:
        "Maintain your current heart-healthy lifestyle. Consider adding more omega-3 rich foods to your diet.",
  ),
  HealthCategory(
    name: "Gut Health",
    score: 78,
    oneLineSummary:
        "Your gut health is within normal range, but could use some attention.",
    goldTest: "Comprehensive Stool Analysis",
    result: "See details",
    range: "Varies by marker",
    recommendation:
        "Increase your intake of probiotic-rich foods and consider a high-quality probiotic supplement.",
  ),
];

class HealthPage extends StatefulWidget {
  @override
  _HealthPageState createState() => _HealthPageState();
}

class _HealthPageState extends State<HealthPage> {
  bool showActivityStatus = false;

  Widget _buildStyledCard(Widget child) {
    return Container(
      decoration: BoxDecoration(
        color: Color.fromRGBO(254, 249, 239,
            0.7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.black.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: child,
      ),
    );
  }

  Widget _buildHealthSummaryCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required Widget graph,
  }) {
    return _buildStyledCard(
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 40),
              SizedBox(width: 8),
              Text(title,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 16)),
          SizedBox(height: 16),
          SizedBox(
            height: 100,
            child: graph,
          ),
        ],
      ),
    );
  }

  Widget _buildStepsGraph() {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barGroups: [
          BarChartGroupData(
              x: 0, barRods: [BarChartRodData(toY: 5000, color: Colors.blue)]),
          BarChartGroupData(
              x: 1, barRods: [BarChartRodData(toY: 8000, color: Colors.blue)]),
          BarChartGroupData(
              x: 2, barRods: [BarChartRodData(toY: 6000, color: Colors.blue)]),
          BarChartGroupData(
              x: 3, barRods: [BarChartRodData(toY: 7000, color: Colors.blue)]),
          BarChartGroupData(
              x: 4, barRods: [BarChartRodData(toY: 9000, color: Colors.blue)]),
          BarChartGroupData(
              x: 5, barRods: [BarChartRodData(toY: 10000, color: Colors.blue)]),
          BarChartGroupData(
              x: 6, barRods: [BarChartRodData(toY: 12000, color: Colors.blue)]),
        ],
        titlesData: FlTitlesData(
          rightTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (double value, TitleMeta meta) {
                const titles = [
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat',
                  'Sun'
                ];
                final intValue = value.toInt();
                if (intValue >= 0 && intValue < titles.length) {
                  return Text(titles[intValue]);
                }
                return const Text('');
              },
            ),
          ),
        ),
        borderData: FlBorderData(
          show: true,
          border: const Border(
            left: BorderSide(color: Colors.black),
            bottom: BorderSide(color: Colors.black),
          ),
        ),
        maxY: 15000,
      ),
    );
  }

  Widget _buildHeartRateGraph() {
    return LineChart(
      LineChartData(
        gridData: FlGridData(show: false),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: [
              FlSpot(0, 60),
              FlSpot(1, 65),
              FlSpot(2, 70),
              FlSpot(3, 68),
              FlSpot(4, 72),
              FlSpot(5, 75),
              FlSpot(6, 74),
            ],
            isCurved: true,
            color: Colors.red,
            dotData: FlDotData(show: false),
            belowBarData: BarAreaData(show: false),
            aboveBarData:
                BarAreaData(show: true, color: Colors.red.withOpacity(0.1)),
          ),
        ],
      ),
    );
  }

  Widget _buildBloodPressureGraph() {
    return LineChart(
      LineChartData(
        gridData: FlGridData(show: false),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: [
              FlSpot(0, 120),
              FlSpot(1, 118),
              FlSpot(2, 122),
              FlSpot(3, 121),
              FlSpot(4, 123),
              FlSpot(5, 119),
              FlSpot(6, 120),
            ],
            isCurved: false,
            color: Colors.blue,
            dotData: FlDotData(show: true),
            belowBarData:
                BarAreaData(show: true, color: Colors.blue.withOpacity(0.1)),
          ),
        ],
      ),
    );
  }

  Widget _buildSleepGraph() {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barGroups: [
          BarChartGroupData(
              x: 0, barRods: [BarChartRodData(toY: 8, color: Colors.indigo)]),
          BarChartGroupData(
              x: 1, barRods: [BarChartRodData(toY: 7, color: Colors.indigo)]),
          BarChartGroupData(
              x: 2, barRods: [BarChartRodData(toY: 6.5, color: Colors.indigo)]),
          BarChartGroupData(
              x: 3, barRods: [BarChartRodData(toY: 7, color: Colors.indigo)]),
          BarChartGroupData(
              x: 4, barRods: [BarChartRodData(toY: 7.5, color: Colors.indigo)]),
          BarChartGroupData(
              x: 5, barRods: [BarChartRodData(toY: 8, color: Colors.indigo)]),
          BarChartGroupData(
              x: 6, barRods: [BarChartRodData(toY: 7, color: Colors.indigo)]),
        ],
        titlesData: FlTitlesData(
          rightTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (double value, TitleMeta meta) {
                const titles = [
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat',
                  'Sun'
                ];
                final intValue = value.toInt();
                if (intValue >= 0 && intValue < titles.length) {
                  return Text(titles[intValue]);
                }
                return const Text('');
              },
            ),
          ),
        ),
        borderData: FlBorderData(
          show: true,
          border: const Border(
            left: BorderSide(color: Colors.black),
            bottom: BorderSide(color: Colors.black),
          ),
        ),
        maxY: 10,
      ),
    );
  }

  Widget _buildActivityStatusCards() {
    return Column(
      children: [
        _buildHealthSummaryCard(
          icon: Icons.favorite,
          title: 'Heart Rate',
          value: '72 bpm',
          color: Colors.red,
          graph: _buildHeartRateGraph(),
        ),
        SizedBox(height: 16),
        _buildHealthSummaryCard(
          icon: Icons.local_hospital,
          title: 'Blood Pressure',
          value: '120/80 mmHg',
          color: Colors.blue,
          graph: _buildBloodPressureGraph(),
        ),
        SizedBox(height: 16),
        _buildHealthSummaryCard(
          icon: Icons.directions_walk,
          title: 'Steps',
          value: '10,000 steps',
          color: Colors.blue,
          graph: _buildStepsGraph(),
        ),
        SizedBox(height: 16),
        _buildHealthSummaryCard(
          icon: Icons.bed,
          title: 'Sleep',
          value: 'Duration: 7h 30m\nQuality: Good',
          color: Colors.indigo,
          graph: _buildSleepGraph(),
        ),
        SizedBox(height: 16),
      ],
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 80) {
      return Colors.green;
    } else if (score >= 60) {
      return Colors.yellow;
    } else {
      return Colors.red;
    }
  }

  Widget _buildHealthSummaryCards() {
    return Column(
      children: healthCategories.map((category) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16.0),
          child: _buildStyledCard(
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircularPercentIndicator(
                      radius: 40.0,
                      lineWidth: 8.0,
                      percent: category.score / 100,
                      center: Text(
                        '${category.score}%',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      progressColor: _getScoreColor(category.score),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(category.name,
                              style: TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold)),
                          SizedBox(height: 8),
                          Text(category.oneLineSummary,
                              style: TextStyle(fontSize: 16)),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Text('Gold Test: ${category.goldTest}',
                    style: TextStyle(fontSize: 16)),
                Text('Result: ${category.result}',
                    style: TextStyle(fontSize: 16)),
                Text('Range: ${category.range}',
                    style: TextStyle(fontSize: 16)),
                SizedBox(height: 16),
                Text(category.recommendation, style: TextStyle(fontSize: 16)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        MainBackground(),
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Scaffold(
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
                                        ? Color(0xFFFFB55D)
                                        : Colors.black,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Container(
                                  height: 2,
                                  width: 60,
                                  color: !showActivityStatus
                                      ? Color(0xFFFFB55D)
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
                                        ? Color(0xFFFFB55D)
                                        : Colors.black,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Container(
                                  height: 2,
                                  width: 60,
                                  color: showActivityStatus
                                      ? Color(0xFFFFB55D)
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
            body: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      showActivityStatus ? 'Health Actvity' : 'Health Summary',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 16),
                    showActivityStatus
                        ? _buildActivityStatusCards()
                        : _buildHealthSummaryCards(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
