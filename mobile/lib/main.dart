import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'utils/my_app_state.dart';
import 'widgets/my_app.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MyApp(),
    ),
  );
}
