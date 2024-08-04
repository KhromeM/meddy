import 'package:flutter/material.dart';
import 'package:blur/blur.dart';
import 'package:meddymobile/widgets/spinning_logo.dart';
import 'package:typewritertext/typewritertext.dart';

class ListeningNotifier extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final typeWriterController = TypeWriterController.fromValue(
      TypeWriterValue(['...', '..', '.', '']),
      duration: const Duration(milliseconds: 225),
      repeat: true, // Loop the animation infinitely
    );

    return Positioned(
      top: 40, // from top of screen to blur UI
      left: MediaQuery.of(context).size.width / 4, // edit for length of blur
      right: MediaQuery.of(context).size.width / 4, // edit for length of blur
      child: Stack(
        alignment: Alignment.center,
        children: [
          Blur(
            blur: 10,
            borderRadius: BorderRadius.circular(30),
            child: Container(
              height: 50, // height for blur
              decoration: BoxDecoration(
                color:
                    Colors.black.withOpacity(0.3), // Default color with opacity
                borderRadius: BorderRadius.circular(30),
              ),
            ),
          ),
          Container(
            height: 50,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
            ),
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 30,
                  height: 30,
                  child: SpinningLogo(
                    initialSpeed: 1.0,
                    width: 30,
                    height: 30,
                    isVary: false,
                  ),
                ),
                SizedBox(width: 10),
                Row(
                  children: [
                    Text(
                      'Listening',
                      style: TextStyle(color: Colors.black, fontSize: 16),
                    ),
                    TypeWriter(
                      controller: typeWriterController,
                      builder: (context, value) {
                        return Text(
                          value.text,
                          style: TextStyle(color: Colors.black, fontSize: 16),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
