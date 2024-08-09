import 'dart:math';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/models/fitness_data.dart';

class FitnessCard extends StatelessWidget {
  final HealthData fitnessData;

  FitnessCard({required this.fitnessData});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFitnessCard(
          icon: Icons.favorite,
          title: 'Heart Rate',
          value: '${fitnessData.bpm.last.bpm} bpm',
          color: Colors.red,
          graph: _buildHeartRateGraph(),
        ),
        SizedBox(height: 16),
        _buildFitnessCard(
          icon: Icons.directions_walk,
          title: 'Steps',
          value: '${fitnessData.steps.last.steps} steps',
          color: Colors.blue,
          graph: _buildStepsGraph(),
        ),
        SizedBox(height: 16),
        _buildFitnessCard(
          icon: Icons.bed,
          title: 'Sleep',
          value:
              'Duration: ${fitnessData.sleep.last.totalSleepMinutes ~/ 60}h ${fitnessData.sleep.last.totalSleepMinutes % 60}m',
          color: Colors.indigo,
          graph: _buildSleepGraph(),
        ),
        SizedBox(height: 16),
      ],
    );
  }

  Widget _buildStyledCard(Widget child) {
    return Container(
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
        child: child,
      ),
    );
  }

  Widget _buildFitnessCard({
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
  final lastSevenDays =
      fitnessData.steps.reversed.take(7).toList().reversed.toList();
  return BarChart(
    BarChartData(
      alignment: BarChartAlignment.spaceAround,
      barGroups: lastSevenDays.asMap().entries.map((entry) {
        return BarChartGroupData(
          x: entry.key,
          barRods: [
            BarChartRodData(
                toY: entry.value.steps.toDouble(), color: Colors.blue)
          ],
        );
      }).toList(),
      titlesData: FlTitlesData(
        rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
        topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
        leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
        bottomTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            getTitlesWidget: (value, meta) {
              final date = lastSevenDays[value.toInt()].date;
              return Text(DateFormat('E').format(date));
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
      gridData: FlGridData(show: true), // Optional: Show grid lines for better alignment
      maxY: lastSevenDays.map((e) => e.steps).reduce(max).toDouble() * 1.2,
    ),
  );
}


  Widget _buildHeartRateGraph() {
    final lastSevenBpm =
        fitnessData.bpm.reversed.take(7).toList().reversed.toList();
    return LineChart(
      LineChartData(
        gridData: FlGridData(show: false),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: lastSevenBpm.asMap().entries.map((entry) {
              return FlSpot(entry.key.toDouble(), entry.value.bpm.toDouble());
            }).toList(),
            color: Colors.red,
            belowBarData: BarAreaData(show: false),
          )
        ],
        lineTouchData: LineTouchData(enabled: false),
      ),
    );
  }

  Widget _buildSleepGraph() {
    final lastSevenDays =
        fitnessData.sleep.reversed.take(7).toList().reversed.toList();
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barGroups: lastSevenDays.asMap().entries.map((entry) {
          return BarChartGroupData(
            x: entry.key,
            barRods: [
              BarChartRodData(
                toY: entry.value.totalSleepMinutes.toDouble(),
                color: Colors.indigo,
              ),
            ],
          );
        }).toList(),
        titlesData: FlTitlesData(
          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (double value, TitleMeta meta) {
                final date = lastSevenDays[value.toInt()].date;
                return Text(DateFormat('E').format(date));
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
        maxY: lastSevenDays
                .map((e) => e.totalSleepMinutes)
                .reduce(max)
                .toDouble() *
            1.2,
      ),
    );
  }
}
