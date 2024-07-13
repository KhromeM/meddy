import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'utils/my_app_state.dart';
import 'widgets/my_app.dart';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import 'package:firebase_core/firebase_core.dart';
>>>>>>> 38247b1 (Fixed wrong google-services.json file.)

void main() {
<<<<<<< HEAD
=======
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
>>>>>>> de8a06edf0292480030e11bb391fea988de65fa3
  runApp(
    ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MyApp(),
    ),
  );
<<<<<<< HEAD
=======
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Meddy',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
                seedColor: Colors.deepOrange),
            textTheme: const TextTheme(
                headlineSmall: TextStyle(
              color: Colors.white,
              fontSize: 46,
              fontWeight: FontWeight.w800,
            ))),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  var current = WordPair.random();

  void getNext() {
    current = WordPair.random();
    notifyListeners();
  }

  var favorites = <WordPair>[];

  void toggleFavorite() {
    if (favorites.contains(current)) {
      favorites.remove(current);
    } else {
      favorites.add(current);
    }
    notifyListeners();
  }

  // Placeholder for previous chats
  var chats = <String>[
    "Hello, how can I help you?",
    "What's the weather like today?",
    "Tell me a joke."
  ];

  // Placeholder for user profile
  var userProfile = {
    "name": "John Doe",
    "email": "john.doe@example.com"
  };
}

class MyHomePage extends StatefulWidget {
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;
  final _scaffoldKey = GlobalKey<ScaffoldState>();

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
          onPressed: () {
            _scaffoldKey.currentState?.openDrawer();
          },
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
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          var appState = context.read<MyAppState>();
          if (selectedIndex == 0) {
            appState.getNext();
          }
        },
        tooltip: 'Next Word',
        child: const Icon(Icons.mic_none),
      ),
      floatingActionButtonLocation:
          FloatingActionButtonLocation.centerDocked,
    );
  }
}

class GeneratorPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();
    var pair = appState.current;

    IconData icon;
    if (appState.favorites.contains(pair)) {
      icon = Icons.favorite;
    } else {
      icon = Icons.favorite_border;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          BigCard(pair: pair),
          SizedBox(height: 10),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  appState.toggleFavorite();
                },
                icon: Icon(icon),
                label: Text('Like'),
              ),
              SizedBox(width: 10),
              ElevatedButton(
                onPressed: () {
                  appState.getNext();
                },
                child: Text('Next'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class BigCard extends StatelessWidget {
  const BigCard({
    super.key,
    required this.pair,
  });

  final WordPair pair;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final style = theme.textTheme.displayMedium!.copyWith(
      color: theme.colorScheme.onPrimary,
    );

    return Card(
      color: theme.colorScheme.primary,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Text(
          pair.asLowerCase,
          style: style,
          semanticsLabel: "${pair.first} ${pair.second}",
        ),
      ),
    );
  }
}

class FavoritesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    if (appState.favorites.isEmpty) {
      return Center(
        child: Text('No favorites yet.'),
      );
    }

    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text('You have '
              '${appState.favorites.length} favorites:'),
        ),
        for (var pair in appState.favorites)
          ListTile(
            leading: Icon(Icons.favorite),
            title: Text(pair.asLowerCase),
          ),
      ],
    );
  }
}

class ChatPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: appState.chats.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(appState.chats[index]),
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Type your message',
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: (text) {
                        // Placeholder for adding chat
                      },
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.send),
                    onPressed: () {
                      // Placeholder for send functionality
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
>>>>>>> d8e2b61 (Updated gitignore to prvent firebase credentials get uploaded. Added dependencies for firebase auth and firebase core)
=======
>>>>>>> de8a06edf0292480030e11bb391fea988de65fa3
}
