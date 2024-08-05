import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/utils/languages.dart';
import 'package:provider/provider.dart';
import 'dart:ui';

class Boxes extends StatelessWidget {
  final List<String> texts;
  final List<String>? images;
  final bool isHighContrast;

  static const List<Color> pastelColors = [
    Color.fromARGB(255, 248, 220, 227), // Pastel pink
    Color.fromARGB(255, 254, 237, 205), // Pastel yellow
    Color.fromARGB(255, 225, 247, 213), // Pastel green
    Color.fromARGB(255, 214, 246, 250), // Pastel blue
    Color(0xFFF0E6FF), // Pastel purple
    Color.fromARGB(255, 249, 229, 211), // Pastel orange
  ];

  static const List<Color> highContrastColors = [
    Color(0xFFFFFFFF), // White
    Color(0xFFFFFFFF), // White
    Color(0xFFFFFFFF), // White
    Color(0xFFFFFFFF), // White
    Color(0xFFFFFFFF), // White
    Color(0xFFFFFFFF), // White
  ];

  const Boxes({
    super.key,
    required this.texts,
    this.images,
    required this.isHighContrast,
  });

  void onBoxTap(BuildContext context, final String myPrompt) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatPage(initialPrompt: myPrompt),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Expanded(
          child: MasonryGridView.count(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.all(10.0),
            crossAxisCount: 2,
            mainAxisSpacing: 10.0,
            crossAxisSpacing: 10.0,
            itemCount: texts.length,
            itemBuilder: (context, index) {
              Color boxColor = isHighContrast
                  ? highContrastColors[index % highContrastColors.length]
                  : pastelColors[index % pastelColors.length];
              return GestureDetector(
                onTap: () => onBoxTap(context, languageProvider.translate(texts[index])),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                    child: Container(
                      width: index.isEven ? 200 : 170,
                      height: Random().nextInt(100) + 50,
                      decoration: BoxDecoration(
                        color: boxColor.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Colors.black.withOpacity(0.1),
                          width: 1,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Text(
                          languageProvider.translate(texts[index]),
                          style: TextStyle(color: Colors.black,
                          fontSize: 18),
                          
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}