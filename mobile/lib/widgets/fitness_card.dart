import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/models/fitness_data.dart';
import 'package:skeletonizer/skeletonizer.dart';

class FitnessCard extends StatelessWidget {
  final HealthData? fitnessData;

  FitnessCard({this.fitnessData});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFitnessCard(
          icon: Icons.favorite,
          title: 'Heart Rate',
          value: '${_getLastBpm()} bpm',
          color: Colors.red,
          graph: _buildHeartRateGraph(),
        ),
        SizedBox(height: 16),
        _buildFitnessCard(
          icon: Icons.directions_walk,
          title: 'Steps',
          value: '${_getLastSteps()} steps',
          color: Colors.blue,
          graph: _buildStepsGraph(),
        ),
        SizedBox(height: 16),
        _buildFitnessCard(
          icon: Icons.bed,
          title: 'Sleep',
          value: 'Duration: ${_getLastSleepDuration()}',
          color: Colors.indigo,
          graph: _buildSleepGraph(),
        ),
        SizedBox(height: 16),
      ],
    );
  }

  int _getLastBpm() {
    return fitnessData?.bpm.isNotEmpty == true ? fitnessData!.bpm.last.bpm : 0;
  }

  int _getLastSteps() {
    return fitnessData?.steps.isNotEmpty == true ? fitnessData!.steps.last.steps : 0;
  }

  String _getLastSleepDuration() {
    if (fitnessData?.sleep.isNotEmpty == true) {
      int minutes = fitnessData!.sleep.last.totalSleepMinutes;
      return '${minutes ~/ 60}h ${minutes % 60}m';
    }
    return '0h 0m';
  }

  Widget _buildFitnessCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required Widget graph,
  }) {
    return Skeletonizer(
      enabled: fitnessData == null,
      child: _buildStyledCard(
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 40),
                SizedBox(width: 8),
                Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 16)),
            SizedBox(height: 16),
            SizedBox(height: 100, child: graph),
          ],
        ),
      ),
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

  Widget _buildStepsGraph() {
    if (fitnessData == null) {
      return _buildSkeletonGraph();
    }
    final lastSevenDays = fitnessData!.steps.reversed.take(7).toList().reversed.toList();
    final barGroups = lastSevenDays.asMap().entries.map((entry) {
      return BarChartGroupData(
        x: entry.key,
        barRods: [BarChartRodData(toY: entry.value.steps.toDouble(), color: Colors.blue)],
      );
    }).toList();

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barGroups: barGroups,
        titlesData: FlTitlesData(
          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                final date = fitnessData!.steps[value.toInt()].date;
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
        gridData: FlGridData(show: true),
        maxY: fitnessData!.steps.map((e) => e.steps).reduce(max).toDouble() * 1.2,
      ),
    );
  }

  Widget _buildHeartRateGraph() {
    if (fitnessData == null) {
      return _buildSkeletonGraph();
    }
    final lastSevenBpm = fitnessData!.bpm.reversed.take(7).toList().reversed.toList();
    final spots = lastSevenBpm.asMap().entries.map((entry) {
      return FlSpot(entry.key.toDouble(), entry.value.bpm.toDouble());
    }).toList();

    return LineChart(
      LineChartData(
        gridData: FlGridData(show: false),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            color: Colors.red,
            belowBarData: BarAreaData(show: false),
          )
        ],
        lineTouchData: LineTouchData(enabled: false),
      ),
    );
  }

  Widget _buildSleepGraph() {
    if (fitnessData == null) {
      return _buildSkeletonGraph();
    }
    final lastSevenDays = fitnessData!.sleep.reversed.take(7).toList().reversed.toList();
    final barGroups = lastSevenDays.asMap().entries.map((entry) {
      return BarChartGroupData(
        x: entry.key,
        barRods: [BarChartRodData(toY: entry.value.totalSleepMinutes.toDouble(), color: Colors.indigo)],
      );
    }).toList();

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barGroups: barGroups,
        titlesData: FlTitlesData(
          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (double value, TitleMeta meta) {
                final date = fitnessData!.sleep[value.toInt()].date;
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
        maxY: fitnessData!.sleep.map((e) => e.totalSleepMinutes).reduce(max).toDouble() * 1.2,
      ),
    );
  }

  Widget _buildSkeletonGraph() {
    return Container(
      height: 100,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: List.generate(
          7,
          (index) => Container(
            width: 30,
            height: 20 + Random().nextInt(60).toDouble(),
            color: Colors.grey[300],
          ),
        ),
      ),
    );
  }
}