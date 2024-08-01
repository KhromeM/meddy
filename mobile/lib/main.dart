import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'utils/my_app_state.dart';
import 'widgets/my_app.dart';
import 'providers/chat_provider.dart'; // Make sure to import ChatProvider

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyAppRoot());
}

class MyAppRoot extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => MyAppState()),
        ChangeNotifierProvider(
            create: (context) => ChatProvider()), // Add ChatProvider
      ],
      child: MyApp(),
    );
  }
}
