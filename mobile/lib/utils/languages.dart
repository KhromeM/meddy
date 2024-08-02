import 'package:flutter/foundation.dart';

final Map<String, Map<String, String>> languageMap = {
  'en': {
    'hello': 'Hello',
    'how_may_i_assist': 'How may I assist you today?',
  },
  'es': {
    'hello': 'Hola',
    'how_may_i_assist': '¿Cómo te puedo ayudar hoy?',
  }, 
};

class Language {
  static String _currentLanguage = 'en'; // Default language

  static String translate(String key) {
    return languageMap[_currentLanguage]?[key] ?? key;
  }

  static void changeLanguage() {
    _currentLanguage = _currentLanguage == 'en' ? 'es' : 'en';
  }

  static String getCurrentLanguage() {
    return _currentLanguage;
  }
}

class LanguageProvider extends ChangeNotifier {
  String get currentLanguage => Language.getCurrentLanguage();

  void changeLanguage() {
    Language.changeLanguage();
    notifyListeners();
  }

  String translate(String key) {
    return Language.translate(key);
  }
}