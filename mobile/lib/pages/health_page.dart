import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:meddymobile/widgets/backnav_app_bar.dart';
import 'package:meddymobile/widgets/main_background.dart';

class HealthPage extends StatefulWidget {
  @override
  _HealthPageState createState() => _HealthPageState();
}

class _HealthPageState extends State<HealthPage>
    with SingleTickerProviderStateMixin {

  Widget _buildStyledCard(Widget child) {
    return Container(
      decoration: BoxDecoration(
        color: Color.fromRGBO(254, 249, 239,
            0.7), // Light background color with some transparency
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

  Widget _buildOxygenSaturationGraph() {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barGroups: [
          BarChartGroupData(
              x: 0, barRods: [BarChartRodData(toY: 98, color: Colors.teal)]),
          BarChartGroupData(
              x: 1, barRods: [BarChartRodData(toY: 99, color: Colors.teal)]),
          BarChartGroupData(
              x: 2, barRods: [BarChartRodData(toY: 97, color: Colors.teal)]),
          BarChartGroupData(
              x: 3, barRods: [BarChartRodData(toY: 98, color: Colors.teal)]),
        ],
      ),
    );
  }

  Widget _buildBloodGlucoseGraph() {
    return PieChart(
      PieChartData(
        sections: [
          PieChartSectionData(
              value: 40, color: Colors.purple, title: '40%', radius: 30),
          PieChartSectionData(
              value: 30,
              color: Colors.purple.withOpacity(0.7),
              title: '30%',
              radius: 30),
          PieChartSectionData(
              value: 20,
              color: Colors.purple.withOpacity(0.5),
              title: '20%',
              radius: 30),
          PieChartSectionData(
              value: 10,
              color: Colors.purple.withOpacity(0.3),
              title: '10%',
              radius: 30),
        ],
      ),
    );
  }

  Widget _buildNutritionGraph() {
    return LineChart(
      LineChartData(
        gridData: FlGridData(show: false),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: [
              FlSpot(0, 2000),
              FlSpot(1, 1800),
              FlSpot(2, 2100),
              FlSpot(3, 1900),
              FlSpot(4, 2200),
            ],
            isCurved: true,
            color: Colors.green,
            dotData: FlDotData(show: false),
            belowBarData:
                BarAreaData(show: true, color: Colors.green.withOpacity(0.2)),
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

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        MainBackground(),
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: Scaffold(
            backgroundColor: Colors.transparent,
            appBar: BacknavAppBar(),
            body: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Health Summary',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 16),
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
                      icon: Icons.spa,
                      title: 'Oxygen Saturation',
                      value: '98%',
                      color: Colors.teal,
                      graph: _buildOxygenSaturationGraph(),
                    ),
                    SizedBox(height: 16),
                    _buildHealthSummaryCard(
                      icon: Icons.bloodtype,
                      title: 'Blood Glucose',
                      value: '90 mg/dL',
                      color: Colors.purple,
                      graph: _buildBloodGlucoseGraph(),
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
                      icon: Icons.fastfood,
                      title: 'Nutrition',
                      value:
                          'Calories: 2000 kcal\nProteins: 150g\nCarbohydrates: 250g\nFats: 70g',
                      color: Colors.green,
                      graph: _buildNutritionGraph(),
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
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
