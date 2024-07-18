import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

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
    'Text 9',
    'Text 10',
    'Text 11',
    'Text 12',
    'Text 13',
    'Text 14',
    'Text 15',
    'Text 16',
    'Text 17',
    'Text 18',
    'Text 19',
    'Text 20'
  ];

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meddy'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        forceMaterialTransparency: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 20),
          Stack(
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
          SizedBox(height: 20),
          Expanded(
            child: MasonryGridView.count(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.all(10.0),
              crossAxisCount:
                  2, // Number of rows in the horizontal scroll direction
              mainAxisSpacing: 10.0,
              crossAxisSpacing: 10.0,
              itemCount:
                  texts.length, // Ensure this matches the length of your lists
              itemBuilder: (context, index) {
                return Container(
                  color: Colors.blue,
                  width: index.isEven ? 200 : 170,
                  height: Random().nextInt(100) + 50,
                  padding: index.isOdd ? EdgeInsets.all(30) : null,
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
          ),
          SizedBox(height: 100),
        ],
      ),
    );
  }
}



/* import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meddy'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        forceMaterialTransparency: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 20),
          Stack(
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
          SizedBox(height: 20),
          Expanded(
            child: GridView.custom(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.all(10.0),
              gridDelegate: SliverWovenGridDelegate.count(
                crossAxisCount: 2,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                pattern: [
                  WovenGridTile(2),
                  WovenGridTile(
                    3 / 4,
                    crossAxisRatio: 0.7,
                    alignment: AlignmentDirectional.centerEnd,
                  ),
                ],
              ),
              childrenDelegate: SliverChildBuilderDelegate(
                (context, index) => Container(
                  color: Colors.blue,
                  height: Random().nextInt(100) + 50,
                  child: Center(
                    child: Text(
                      'Box ${index + 1}',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                      ),
                    ),
                  ),
                ),
                childCount: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
 */