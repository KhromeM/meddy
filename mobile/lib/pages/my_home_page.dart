import 'package:flutter/material.dart';
import 'chat_page.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  void _toggleStar() {
    // replace drawer functionality to the star page from Pi
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
    } else {
      _scaffoldKey.currentState?.openDrawer();
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget page;
    switch (selectedIndex) {
      case 0:
        page = ChatPage();
      default:
        throw UnimplementedError('no widget for $selectedIndex');
    }

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('Meddy'),
        centerTitle: true,
        leading: IconButton(
          icon:
              Icon(Icons.star), // change from drawer to the star thing from Pi
          onPressed: _toggleStar,
          // will add sliver anim / card stack interface
        ),
      ),
      body: page,
    );
  }
}
