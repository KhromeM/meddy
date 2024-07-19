import 'package:flutter/material.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/widgets/boxes.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/mic_page.dart';

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
          appBar: AppBar(
            title: const Text('Meddy'),
            centerTitle: true,
            elevation: 0,
            backgroundColor: Colors.transparent,
            forceMaterialTransparency: true,
            leading: InkWell(
              onTap: () {
                //put api call
              },
              child: Padding(
                padding: const EdgeInsets.only(left: 10),
                child: Stack(
                  children: [
                    //put sth here
                    Icon(
                      Icons.circle,
                      size: 60,
                    )
                  ],
                ),
              ),
            ),
            actions: [
              InkWell(
                onTap: () {
                  //put api call
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ChatPage()),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.only(right: 10),
                  child: Stack(
                    children: [
                      //put sth here
                      Icon(Icons.circle, size: 60)
                    ],
                  ),
                ),
              ),
            ],
          ),
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