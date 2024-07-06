import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';

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
  var userProfile = {"name": "John Doe", "email": "john.doe@example.com"};
}
