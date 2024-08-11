import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:meddymobile/pages/screen_wrapper.dart';
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
    bodyLarge: TextStyle(color: Colors.white),
    bodyMedium: TextStyle(color: Colors.white70),
  ),
  buttonTheme: ButtonThemeData(
    buttonColor: Colors.black,
    textTheme: ButtonTextTheme.primary,
  ),
  fontFamily: 'C3',
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
    // Set the status bar content to black
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
    ));

    return HighContrastMode(
      isHighContrast: _isHighContrast,
      toggleHighContrastMode: _toggleHighContrastMode,
      child: MaterialApp(
        title: 'Meddy',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.deepOrange,
            background: Color(0xFFFAF3EA),
          ),
          fontFamily: 'Nunito',
          scaffoldBackgroundColor: Color(0xFFFAF3EA),
        ),
        home: StreamBuilder<User?>(
          stream: FirebaseAuth.instance.authStateChanges(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator();
            } else if (snapshot.hasData) {
              return const ScreenWrapper();
            }
            return SignInPage();
          },
        ),
      ),
    );
  }
}
