import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:meddymobile/pages/back_page.dart';
import 'package:meddymobile/pages/signin_page.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import '../pages/my_home_page.dart';

// Define the normal theme
final ThemeData normalTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
  fontFamily: 'Nunito',
);

// Define the high contrast theme
final ThemeData highContrastTheme = ThemeData(
  primaryColor: Colors.black,
  colorScheme: ColorScheme.fromSwatch().copyWith(
    secondary: Colors.white,
    brightness: Brightness.dark,
  ),
  scaffoldBackgroundColor: Colors.black,
  textTheme: TextTheme(
    bodyLarge: TextStyle(color: Colors.white), // bodyText1 -> bodyLarge
    bodyMedium: TextStyle(color: Colors.white70), // bodyText2 -> bodyMedium
  ),
  buttonTheme: ButtonThemeData(
    buttonColor: Colors.black,
    textTheme: ButtonTextTheme.primary,
  ),
  fontFamily: 'Nunito',
);

class MyApp extends StatefulWidget {
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _isHighContrast = false;

  void _toggleHighContrastMode() {
    setState(() {
      _isHighContrast = !_isHighContrast;
    });
  }

  @override
  Widget build(BuildContext context) {
    return HighContrastMode(
      isHighContrast: _isHighContrast,
      toggleHighContrastMode: _toggleHighContrastMode,
      child: MaterialApp(
        title: 'Meddy',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
          fontFamily: 'Nunito',
        ),
        home: StreamBuilder<User?>(
          stream: FirebaseAuth.instance.authStateChanges(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator(); // Show a loading indicator while waiting for auth state
            } else if (snapshot.hasData) {
              return ScreenWrapper();
            }
            return SignInPage();
          },
        ),
      ),
    );
  }
}
