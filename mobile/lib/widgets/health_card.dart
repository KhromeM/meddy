import 'package:flutter/material.dart';
import 'package:meddymobile/models/health_category.dart';

class HealthCard extends StatelessWidget {
  final HealthCategory category;

  HealthCard({required this.category});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(category.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('Score: ${category.score}'),
            LinearProgressIndicator(
              value: category.score / 100,
              color: category.score > 80 ? Colors.green : category.score > 60 ? Colors.yellow : Colors.red,
            ),
            SizedBox(height: 8),
            Text(category.oneLineSummary),
            Text('Gold Standard Test: ${category.goldTest}'),
            Text('Result: ${category.result}'),
            Text('Normal Range: ${category.range}'),
            Text('Recommendation: ${category.recommendation}'),
          ],
        ),
      ),
    );
  }
}
