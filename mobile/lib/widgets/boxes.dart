import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:meddymobile/utils/languages.dart';
import 'package:provider/provider.dart';
import 'dart:ui';

class Boxes extends StatelessWidget {
  final List<String> texts;
  final bool isHighContrast;

  // Added some random image links for demonstration
  final List<String> images = [
    'https://picsum.photos/200',
    'https://picsum.photos/201',
    'https://picsum.photos/202',
    'https://picsum.photos/203',
    'https://picsum.photos/204',
    'https://picsum.photos/205',
  ];

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

  Boxes({
    super.key,
    required this.texts,
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
        return Container(
          height: MediaQuery.of(context).size.height * 0.3,
          child: MasonryGridView.count(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(
                horizontal: MediaQuery.of(context).size.width * 0.03),
            crossAxisCount: 1,
            mainAxisSpacing: MediaQuery.of(context).size.width * 0.03,
            crossAxisSpacing: MediaQuery.of(context).size.width * 0.03,
            itemCount: texts.length,
            itemBuilder: (context, index) {
              Color boxColor = isHighContrast
                  ? highContrastColors[index % highContrastColors.length]
                  : pastelColors[index % pastelColors.length];
              return GestureDetector(
                onTap: () =>
                    onBoxTap(context, languageProvider.translate(texts[index])),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                    child: Container(
                      width: MediaQuery.of(context).size.width * 0.45,
                      decoration: BoxDecoration(
                        color: boxColor.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Colors.black.withOpacity(0.1),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Container(
                            width: double.infinity,
                            height: MediaQuery.of(context).size.height * 0.15,
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                image:
                                    NetworkImage(images[index % images.length]),
                                fit: BoxFit.cover,
                              ),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(20),
                                topRight: Radius.circular(20),
                              ),
                            ),
                          ),
                          SizedBox(height: 8.0),
                          Padding(
                            padding: const EdgeInsets.only(
                                top: 10, right: 10, left: 10),
                            child: Text(
                              languageProvider.translate(texts[index]),
                              style:
                                  TextStyle(color: Colors.black, fontSize: 18),
                            ),
                          ),
                        ],
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
