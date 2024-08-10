import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/utils/languages.dart';
import 'package:provider/provider.dart';

class Boxes extends StatelessWidget {
  final List<String> texts;
  final bool isHighContrast;

  final List<String> images = [
    'assets/images/c2.webp',
    'assets/images/i4up.png',
    'assets/images/i2up.png',
    'assets/images/i3.png',
    'assets/images/i5.webp',
    'assets/images/i6.webp',
    'assets/images/i7.webp',
    'assets/images/i8.webp',
    'assets/images/i9.webp',
    'assets/images/i10.webp',
  ];

  Boxes({
    Key? key,
    required this.texts,
    required this.isHighContrast,
  }) : super(key: key);

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
          child: CarouselSlider.builder(
            itemCount: texts.length,
            options: CarouselOptions(
              height: MediaQuery.of(context).size.height * 0.3,
              viewportFraction: 0.8,
              initialPage: 0,
              enableInfiniteScroll: true,
              reverse: false,
              autoPlay: true,
              autoPlayInterval: Duration(seconds: 3),
              autoPlayAnimationDuration: Duration(milliseconds: 800),
              autoPlayCurve: Curves.fastOutSlowIn,
              enlargeCenterPage: true,
              scrollDirection: Axis.horizontal,
            ),
            itemBuilder: (context, index, realIndex) {
              return GestureDetector(
                onTap: () => onBoxTap(context, languageProvider.translate(texts[index])),
                child: Container(
                  margin: EdgeInsets.symmetric(horizontal: 5.0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.3),
                        spreadRadius: 1,
                        blurRadius: 5,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
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
                                Colors.black.withOpacity(0.6),
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