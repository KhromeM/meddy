import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/models/fitness_data.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import 'package:skeletonizer/skeletonizer.dart';

class FitnessCard extends StatelessWidget {
  final HealthData? fitnessData;

  FitnessCard({this.fitnessData});

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    return Column(
      children: [
        _buildFitnessCard(
          context,
          icon: Icons.favorite,
          title: 'Heart Rate',
          value: '${_getLastBpm()} bpm',
          color: Colors.red,
          graph: _buildHeartRateGraph(isHighContrast),
        ),
        SizedBox(height: 16),
        _buildFitnessCard(
          context,
          icon: Icons.directions_walk,
          title: 'Steps',
          value: '${_getLastSteps()} steps',
          color: Colors.blue,
          graph: _buildStepsGraph(isHighContrast),
        ),
        SizedBox(height: 16),
        _buildFitnessCard(
          context,
          icon: Icons.bed,
          title: 'Sleep',
          value: 'Duration: ${_getLastSleepDuration()}',
          color: Colors.indigo,
          graph: _buildSleepGraph(isHighContrast),
        ),
        SizedBox(height: 16),
      ],
    );
  }

  int _getLastBpm() {
    return fitnessData?.bpm.isNotEmpty == true ? fitnessData!.bpm.last.bpm : 0;
  }

  int _getLastSteps() {
    return fitnessData?.steps.isNotEmpty == true
        ? fitnessData!.steps.last.steps
        : 0;
  }

  String _getLastSleepDuration() {
    if (fitnessData?.sleep.isNotEmpty == true) {
      int minutes = fitnessData!.sleep.last.totalSleepMinutes;
      return '${minutes ~/ 60}h ${minutes % 60}m';
    }
    return '0h 0m';
  }

  Widget _buildFitnessCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required Widget graph,
  }) {
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    return Skeletonizer(
      enabled: fitnessData == null,
      child: _buildStyledCard(
        context,
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon,
                    color: color,
                    size: isHighContrast
                        ? 50
                        : 40), // Adjust size for high contrast
                SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: isHighContrast
                        ? 20
                        : 18, // Adjust size for high contrast
                    fontWeight: FontWeight.bold,
                    color: isHighContrast ? Colors.white : Colors.black,
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize:
                    isHighContrast ? 18 : 16, // Adjust size for high contrast
                color: isHighContrast ? Colors.white : Colors.black,
              ),
            ),
            SizedBox(height: 16),
            SizedBox(height: 100, child: graph),
          ],
        ),
      ),
    );
  }

  Widget _buildStyledCard(BuildContext context, Widget child) {
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    return Container(
      decoration: BoxDecoration(
        color:
            isHighContrast ? Colors.black : Color.fromRGBO(254, 249, 239, 0.7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isHighContrast ? Colors.white : Colors.black.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: child,
      ),
    );
  }

  Widget _buildStepsGraph(bool isHighContrast) {
    if (fitnessData == null) {
      return _buildSkeletonGraph(isHighContrast);
    }

    final lastSevenDays =
        fitnessData!.steps.reversed.take(7).toList().reversed.toList();
    final barGroups = lastSevenDays.asMap().entries.map((entry) {
      return BarChartGroupData(
        x: entry.key,
        barRods: [
          BarChartRodData(
            toY: entry.value.steps.toDouble(),
            color: isHighContrast ? Colors.white : Colors.blue,
            width: 16, // Adjust width as needed
          ),
        ],
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
                final date = fitnessData!.steps[value.toInt()].date;
                return Text(
                  DateFormat('E').format(date),
                  style: TextStyle(
                    color: isHighContrast ? Colors.white : Colors.black,
                  ),
                );
              },
            ),
          ),
        ),
        borderData: FlBorderData(
          show: true,
          border: Border(
            left: BorderSide(
              color: isHighContrast ? Colors.white : Colors.black,
            ),
            bottom: BorderSide(
              color: isHighContrast ? Colors.white : Colors.black,
            ),
          ),
        ),
        gridData: FlGridData(show: true),
        maxY:
            fitnessData!.steps.map((e) => e.steps).reduce(max).toDouble() * 1.2,
      ),
    );
  }

  Widget _buildHeartRateGraph(bool isHighContrast) {
    if (fitnessData == null) {
      return _buildSkeletonGraph(isHighContrast);
    }

    final lastSevenBpm =
        fitnessData!.bpm.reversed.take(7).toList().reversed.toList();
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
            color: isHighContrast ? Colors.white : Colors.red,
            belowBarData: BarAreaData(show: false),
          )
        ],
        lineTouchData: LineTouchData(enabled: false),
      ),
    );
  }

  Widget _buildSleepGraph(bool isHighContrast) {
    if (fitnessData == null) {
      return _buildSkeletonGraph(isHighContrast);
    }

    final lastSevenDays =
        fitnessData!.sleep.reversed.take(7).toList().reversed.toList();
    final barGroups = lastSevenDays.asMap().entries.map((entry) {
      return BarChartGroupData(
        x: entry.key,
        barRods: [
          BarChartRodData(
            toY: entry.value.totalSleepMinutes.toDouble(),
            color: isHighContrast ? Colors.white : Colors.indigo,
            width: 16, // Adjust width as needed
          ),
        ],
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
                return Text(
                  DateFormat('E').format(date),
                  style: TextStyle(
                    color: isHighContrast ? Colors.white : Colors.black,
                  ),
                );
              },
            ),
          ),
        ),
        borderData: FlBorderData(
          show: true,
          border: Border(
            left: BorderSide(
              color: isHighContrast ? Colors.white : Colors.black,
            ),
            bottom: BorderSide(
              color: isHighContrast ? Colors.white : Colors.black,
            ),
          ),
        ),
        maxY: fitnessData!.sleep
                .map((e) => e.totalSleepMinutes)
                .reduce(max)
                .toDouble() *
            1.2,
      ),
    );
  }

  Widget _buildSkeletonGraph(bool isHighContrast) {
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
            color: isHighContrast ? Colors.white : Colors.grey[300],
          ),
        ),
      ),
    );
  }
}
