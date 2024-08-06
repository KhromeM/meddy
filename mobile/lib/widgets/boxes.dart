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

  final List<String> images = [
    'assets/images/i1.jpeg',
    'assets/images/i2.png',
    'assets/images/i3.png',
    'assets/images/i4.png',
    'assets/images/i5.webp',
    'assets/images/i6.webp',
    'assets/images/i7.webp',
    'assets/images/i8.webp',
    'assets/images/i9.webp',
    'assets/images/i10.webp',
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
            mainAxisSpacing: MediaQuery.of(context).size.width * 0.06,
            itemCount: texts.length,
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: () =>
                    onBoxTap(context, languageProvider.translate(texts[index])),
                child: AspectRatio(
                  aspectRatio: 3 / 4, // Adjust this ratio as needed
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image(
                          image: AssetImage(images[index % images.length]),
                          fit: BoxFit.cover,
                        ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withOpacity(0.7),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 10,
                          right: 10,
                          bottom: 10,
                          child: Text(
                            languageProvider.translate(texts[index]),
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
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
