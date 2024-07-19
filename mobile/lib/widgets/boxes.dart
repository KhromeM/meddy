// custom_container.dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

class Boxes extends StatelessWidget {
  final List<String> texts;
  final List<String> images;

  const Boxes({
    super.key,
    required this.texts,
    required this.images,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: MasonryGridView.count(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.all(10.0),
        crossAxisCount: 2, // Number of rows in the horizontal scroll direction
        mainAxisSpacing: 10.0,
        crossAxisSpacing: 10.0,
        itemCount: texts.length, // Ensure this matches the length of your lists
        itemBuilder: (context, index) {
          return Container(
            width: index.isEven ? 200 : 170,
            height: Random().nextInt(100) + 50,
            padding: index.isOdd ? EdgeInsets.all(30) : null,
            decoration: BoxDecoration(
              color: Colors.blue,
              borderRadius: BorderRadius.circular(20), // Rounded borders
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  images[index],
                  fit: BoxFit.cover,
                ),
                SizedBox(height: 10),
                Text(
                  texts[index],
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
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
