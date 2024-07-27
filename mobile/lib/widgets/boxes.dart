import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

class Boxes extends StatelessWidget {
  final List<String> texts;
  final List<String>? images;
  final bool isHighContrast;

  static const List<Color> pastelColors = [
    Color(0xFFFFD1DC), // Pastel pink
    Color(0xFFFFE5B4), // Pastel yellow
    Color(0xFFD0F0C0), // Pastel green
    Color(0xFFB0E0E6), // Pastel blue
    Color(0xFFF0E6FF), // Pastel purple
    Color(0xFFFFDAB9), // Pastel orange
  ];

  static const List<Color> highContrastColors = [
    Color(0xFF000000), // Black
    Color(0xFFFFFFFF), // White
    Color(0xFFFF0000), // Red
    Color(0xFF00FF00), // Green
    Color(0xFF0000FF), // Blue
    Color(0xFFFFFF00), // Yellow
  ];

  const Boxes({
    super.key,
    required this.texts,
    this.images,
    required this.isHighContrast,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: MasonryGridView.count(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.all(10.0),
        crossAxisCount: 2,
        mainAxisSpacing: 10.0,
        crossAxisSpacing: 10.0,
        itemCount: texts.length,
        itemBuilder: (context, index) {
          return Container(
            width: index.isEven ? 200 : 170,
            height: Random().nextInt(100) + 50,
            decoration: BoxDecoration(
              color: isHighContrast
                  ? highContrastColors[
                      index % pastelColors.length]
                  : pastelColors[
                      index % pastelColors.length],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Stack(
              children: [
                if (images != null &&
                    index < images!.length)
                  Positioned.fill(
                    child: ClipRRect(
                      borderRadius:
                          BorderRadius.circular(20),
                      child: Image.asset(
                        images![index],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: Padding(
                    padding: EdgeInsets.all(12.0),
                    child: Text(
                      texts[index],
                      style: TextStyle(
                        color: const Color.fromARGB(
                            255, 0, 0, 0),
                        fontSize: 20,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 4,
                      // overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
