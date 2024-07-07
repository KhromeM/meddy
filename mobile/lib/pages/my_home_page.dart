import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'generator_page.dart';
import 'favorites_page.dart';
import 'chat_page.dart';
import '../utils/my_app_state.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  void _toggleDrawer() {
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
        page = GeneratorPage();
      case 1:
        page = FavoritesPage();
      case 2:
        page = ChatPage();
      default:
        throw UnimplementedError(
            'no widget for $selectedIndex');
    }

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('Meddy'),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: _toggleDrawer,
        ),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color:
                    Theme.of(context).colorScheme.primary,
              ),
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  Text(
                    'User Profile',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Name: John Doe', // Placeholder value
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    'Email: john.doe@example.com', // Placeholder value
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              title: Text('Previous Chats'),
              onTap: () {
                // Placeholder action for previous chats
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: Text('Settings'),
              onTap: () {
                // Placeholder action for settings
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: page,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: const Icon(Icons.messenger_outline),
              onPressed: () {
                setState(() {
                  selectedIndex = 2;
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.home),
              onPressed: () {
                setState(() {
                  selectedIndex = 0;
                });
              },
            ),
          ],
        ),
      ),
      floatingActionButton: selectedIndex == 0
          ? FloatingActionButton(
              onPressed: () {
                var appState = context.read<MyAppState>();
                if (selectedIndex == 0) {
                  appState.getNext();
                }
              },
              tooltip: 'Next Word',
              child: const Icon(Icons.mic_none),
            )
          : null,
      floatingActionButtonLocation:
          FloatingActionButtonLocation.centerDocked,
    );
  }
}
