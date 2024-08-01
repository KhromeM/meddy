import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:meddymobile/widgets/backnav_app_bar.dart';
import 'package:meddymobile/widgets/main_background.dart';

class HealthPage extends StatelessWidget {

  Widget _buildHealthSummaryCard(
      {required IconData icon,
      required String title,
      required String value,
      required Color color}) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: color, size: 40),
        title: Text(title,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        subtitle: Text(value, style: TextStyle(fontSize: 16)),
      ),
    );
  }

  Widget _buildGraphCard(String title) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  barGroups: [
                    BarChartGroupData(
                      x: 0,
                      barRods: [BarChartRodData(toY: 70, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 1,
                      barRods: [BarChartRodData(toY: 75, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 2,
                      barRods: [BarChartRodData(toY: 80, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 3,
                      barRods: [BarChartRodData(toY: 85, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 4,
                      barRods: [BarChartRodData(toY: 90, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 5,
                      barRods: [BarChartRodData(toY: 95, color: Colors.green)],
                    ),
                    BarChartGroupData(
                      x: 6,
                      barRods: [BarChartRodData(toY: 100, color: Colors.green)],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        MainBackground(),
        Scaffold(
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
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  _buildHealthSummaryCard(
                    icon: Icons.favorite,
                    title: 'Heart Rate',
                    value: '72 bpm',
                    color: Colors.red,
                  ),
                  SizedBox(height: 16),
                  _buildHealthSummaryCard(
                    icon: Icons.local_hospital,
                    title: 'Blood Pressure',
                    value: '120/80 mmHg',
                    color: Colors.blue,
                  ),
                  SizedBox(height: 16),
                  _buildHealthSummaryCard(
                    icon: Icons.thermostat,
                    title: 'Body Temperature',
                    value: '98.6°F',
                    color: Colors.orange,
                  ),
                  SizedBox(height: 16),
                  _buildHealthSummaryCard(
                    icon: Icons.bloodtype,
                    title: 'Blood Glucose',
                    value: '90 mg/dL',
                    color: Colors.purple,
                  ),
                  SizedBox(height: 16),
                  _buildGraphCard('Fitness Activity'),
                  SizedBox(height: 16),
                  _buildHealthSummaryCard(
                    icon: Icons.fastfood,
                    title: 'Nutrition',
                    value:
                        'Calories: 2000 kcal\nProteins: 150g\nCarbohydrates: 250g\nFats: 70g',
                    color: Colors.green,
                  ),
                  SizedBox(height: 16),
                  _buildHealthSummaryCard(
                    icon: Icons.bed,
                    title: 'Sleep',
                    value: 'Duration: 7h 30m\nQuality: Good',
                    color: Colors.indigo,
                  ),
                  SizedBox(height: 16),
                ],
              ),
            ),
          ),
        )
      ],
    );
  }
}
