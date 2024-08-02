import 'package:flutter/foundation.dart';

final Map<String, Map<String, String>> languageMap = {
  'en': {
    'hello': 'Hi',
    'how_may_i_assist': 'How may I assist you today?',
    'reminders': 'Reminders',
    'reminder': 'Reminder',
    'health': 'Health',
    'logout': 'Logout',
    'today_reminders': "Today's Reminders",
    'upcoming_reminders': "Upcoming Reminders",
    'no_reminders': 'No reminders!',
    'cancel': 'Cancel',
    'apply': 'Apply',
    'reminder_title': 'Reminder Title',
    'new_reminder': 'New Reminder',
    'date': 'Date: ',
    'time': 'Time: ',
    'repeat': 'Repeat: ',
    'repeat_options': 'Repeat Options',
    'never': 'Never',
    'daily': 'Daily',
    'weekends': 'Weekends',
    'weekdays': 'Weekdays',
    'discard_changes_q': 'Discard Changes?',
    'are_you_sure': 'Are you sure you want to discard changes?',
    'discard_changes': 'Discard Changes',
    'box1': 'How does sunlight improve my mental health?',
    'box2': 'What are the best foods to eat for heart health?',
    'box3': 'How can I improve my sleep quality?',
    'box4': 'How does stress affect the immune system?',
    'box5': "What's the recommended daily water intake?",
    'box6': 'What are common causes of frequent headaches?',
    'box7': 'Can you suggest ways to boost my energy levels?',
    'box8': 'How does meditation impact overall health?',

  },
  'es': {
    'hello': 'Hola',
    'how_may_i_assist': '¿Cómo te puedo ayudar hoy?',
    'reminders': 'Recordatorios',
    'reminder': 'Recordatorio',
    'health': 'Salud',
    'logout': 'Cerrar sesión',
    'today_reminders': "Recordatorios Hoy",
    'upcoming_reminders': "Recordatorios Próximos",
    'no_reminders': 'Sin recordatorios!',
    'cancel': 'Cancelar',
    'apply': 'Confirmar',
    'reminder_title': 'Nombre Recordatorio',
    'new_reminder': 'Recordatorio Nuevo',
    'date': 'Día: ',
    'time': 'Hora: ',
    'repeat': 'Repetir: ',
    'repeat_options': 'Repetir',
    'never': 'Nunca',
    'daily': 'Diario',
    'weekends': 'Fines de semana',
    'weekdays': 'Días laborales',
    'discard_changes_q': 'Descartar Cambios?',
    'are_you_sure': '¿Está seguro que quiere descartar cambios?',
    'discard_changes': 'Descartar Cambios',
    'box1': '¿Cómo mejora la luz solar mi salud mental?',
    'box2': '¿Cuáles son los mejores alimentos para la salud del corazón?',
    'box3': '¿Cómo puedo mejorar la calidad de mi sueño?',
    'box4': '¿Cómo afecta el estrés al sistema inmunológico?',
    'box5': '¿Cuál es la ingesta diaria de agua recomendada?',
    'box6': '¿Cuáles son las causas comunes de dolores de cabeza frecuentes?',
    'box7': '¿Puedes sugerir formas de aumentar mis niveles de energía?',
    'box8': '¿Cómo impacta la meditación en la salud general?',
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