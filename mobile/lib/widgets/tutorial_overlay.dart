import 'package:flutter/material.dart';

class TutorialOverlayFullScreen extends StatelessWidget {
  final Offset targetPosition;
  final Size targetSize;
  final String message;

  TutorialOverlayFullScreen({
    required this.targetPosition,
    required this.targetSize,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          GestureDetector(
            onTap: () {
              Navigator.of(context).pop();
            },
            child: SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: CustomPaint(
                painter: HolePainter(
                  holePosition: targetPosition,
                  holeSize: targetSize,
                ),
              ),
            ),
          ),
          Positioned(
            left:
                targetPosition.dx - (targetSize.width / 2),
            top: targetPosition.dy +
                (targetSize.height / 2) +
                10,
            child: Column(
              children: [
                Icon(
                  Icons.arrow_downward,
                  size: 30,
                  color: Colors.white,
                ),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.all(8),
                  child: Text(
                    "Testing",
                    style: TextStyle(color: Colors.black),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class HolePainter extends CustomPainter {
  final Offset holePosition;
  final Size holeSize;

  HolePainter(
      {required this.holePosition, required this.holeSize});

  @override
  void paint(Canvas canvas, Size size) {
    // Save the layer and apply a clipping mask
    canvas.saveLayer(
        Rect.fromLTWH(0, 0, size.width, size.height),
        Paint());

    // Draw the dimmed background
    Paint overlayPaint = Paint()
      ..color = Colors.black54
      ..style = PaintingStyle.fill;
    canvas.drawRect(
        Rect.fromLTWH(0, 0, size.width, size.height),
        overlayPaint);

    // Draw the transparent hole
    Paint clearPaint = Paint()..blendMode = BlendMode.clear;
    canvas.drawOval(
      Rect.fromCenter(
          center: holePosition,
          width: holeSize.width,
          height: holeSize.height),
      clearPaint,
    );

    // Restore the layer
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
