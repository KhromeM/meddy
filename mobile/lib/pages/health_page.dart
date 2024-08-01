import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class HealthPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Health Status'),
      ),
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
                icon: Icons.show_chart,
                title: 'Steps',
                value: '10,000',
                color: Colors.green,
              ),
              SizedBox(height: 16),
              _buildHealthSummaryCard(
                icon: Icons.local_hospital,
                title: 'Blood Pressure',
                value: '120/80 mmHg',
                color: Colors.blue,
              ),
              SizedBox(height: 16),
              _buildGraphCard(),
              SizedBox(height: 16),
              _buildRecommendationsCard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHealthSummaryCard({required IconData icon, required String title, required String value, required Color color}) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: color, size: 40),
        title: Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        subtitle: Text(value, style: TextStyle(fontSize: 16)),
      ),
    );
  }

  Widget _buildGraphCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Weekly Heart Rate', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  barGroups: [
                    BarChartGroupData(
                      x: 0,
                      barRods: [
                        BarChartRodData(toY: 70, color: Colors.red),
                      ],
                    ),
                    BarChartGroupData(
                      x: 1,
                      barRods: [
                        BarChartRodData(toY: 75, color: Colors.red),
                      ],
                    ),
                    BarChartGroupData(
                      x: 2,
                      barRods: [
                        BarChartRodData(toY: 80, color: Colors.red),
                      ],
                    ),
                    BarChartGroupData(
                      x: 3,
                      barRods: [
                        BarChartRodData(toY: 85, color: Colors.red),
                      ],
                    ),
                    BarChartGroupData(
                      x: 4,
                      barRods: [
                        BarChartRodData(toY: 90, color: Colors.red),
                      ],
                    ),
                    BarChartGroupData(
                      x: 5,
                      barRods: [
                        BarChartRodData(toY: 95, color: Colors.red),
                      ],
                    ),
                    BarChartGroupData(
                      x: 6,
                      barRods: [
                        BarChartRodData(toY: 100, color: Colors.red),
                      ],
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

  Widget _buildRecommendationsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Recommendations', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('- Drink more water'),
            Text('- Exercise for 30 minutes daily'),
            Text('- Monitor your blood pressure regularly'),
          ],
        ),
      ),
    );
  }
}
