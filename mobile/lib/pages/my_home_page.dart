import 'package:flutter/material.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/widgets/boxes.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/mic_page.dart';
import 'package:meddymobile/widgets/custom_app_bar.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final List<String> texts = [
    'Text 1',
    'Text 2',
    'Text 3',
    'Text 4',
    'Text 5',
    'Text 6',
    'Text 7',
    'Text 8',
  ];

  // use temporary assets locally or comment out
  final List<String> images = [
    'assets/image1.jpg',
    'assets/image2.jpg',
    'assets/image3.jpg',
    'assets/image4.jpg',
    'assets/image5.jpg',
    'assets/image6.jpg',
    'assets/image7.jpg',
    'assets/image8.jpg',
    'assets/image9.jpg',
    'assets/image10.jpg',
    'assets/image11.jpg',
    'assets/image12.jpg',
    'assets/image13.jpg',
    'assets/image14.jpg',
    'assets/image15.jpg',
    'assets/image16.jpg',
    'assets/image17.jpg',
    'assets/image18.jpg',
    'assets/image19.jpg',
    'assets/image20.jpg'
  ];

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        MainBackground(),
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: CustomAppBar(),
          body: Column(
            children: [
              SizedBox(height: 20),
              InkWell(
                onTap: () {
                  _showMic();
                },
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 100.0,
                      height: 100.0,
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                    Icon(
                      Icons.mic,
                      size: 50,
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20),
              // add images here or comment out next line if working on android emu
              Boxes(texts: texts, images: images),
              SizedBox(height: 100),
            ],
          ),
        ),
      ],
    );
  }

  void _showMic() {
    showDialog(
      context: context,
      barrierDismissible: true, // prevent closing the dialog
      builder: (context) {
        return Material(
          color: Theme.of(context).colorScheme.surface,
          child: MicPage(),
        );
      },
    );
  }
}
