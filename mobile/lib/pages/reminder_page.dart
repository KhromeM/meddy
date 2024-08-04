import 'package:flutter/material.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/backnav_app_bar.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/services/appointment_service.dart';
import 'package:meddymobile/widgets/new_reminder_bottom_sheet.dart';
import 'package:meddymobile/utils/languages.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
class ReminderPage extends StatefulWidget {
  const ReminderPage({super.key});

  @override
  _ReminderPageState createState() => _ReminderPageState();
}

class _ReminderPageState extends State<ReminderPage> { 
  final AuthService _authService = AuthService();
  late String _firstName;
  List<Map<String, dynamic>> _reminders = [];
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  bool _showDatePicker = false;
  bool _showTimePicker = false;
  String _repeatOption = 'Never';
  final String baseUrl = 'https://trymeddy.com/api'; 

  @override
  void initState() {
    super.initState();
    _firstName = _authService.getFirstName() ?? 'User';
    _fetchAppointments();
  }

  void _fetchAppointments() async {
    final service = AppointmentService();
    String? user = await _authService.getIdToken();

    try {

      //final reminder = await service.createAppointment(date: '2024-08-03', userId: user);
    //   final response = await http.post(
    //   Uri.parse('$baseUrl/info/reminder'),
    //   headers: {'Content-Type': 'application/json', 'idToken': 'dev'},
    //   body: jsonEncode({
    //     'date': '2024-08-03',
    //     'userId': user,
    //   }),
    // );


      final appointments = await service.getAllAppointments();
    print(appointments);
    print('success');
    
    } catch (e) {
      // Handle error
      print(e);
    }
  }

  void _addReminder(DateTime date, TimeOfDay time) async {
    final service = AppointmentService();
    String? user = await _authService.getIdToken();

    try {
      // await service.createAppointment(
      //   date: DateFormat('yyyy-MM-dd').format(date),
      //   userId: 'userId', // Replace with actual user ID
      // );
      // // Update UI
      // setState(() {
      //   _reminders.add({
      //     'date': date,
      //     'time': time,
      //     'repeatDays': _repeatOption,
      //   });
      // });
      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(
      //     content: Text('Reminder added!'),
      //     behavior: SnackBarBehavior.floating,
      //     margin: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      //     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      //   ),
      // );
      final response = await http.post(
      Uri.parse('$baseUrl/info/reminder'),
      headers: {'Content-Type': 'application/json', 'idToken': 'dev'},
      body: jsonEncode({
        date: DateFormat('yyyy-MM-dd').format(date),
        'userId': user, 
      }),
    );
    } catch (e) {
      // Handle error
      print(e);
    }
  }

  void _removeReminder(int index) async {
    final service = AppointmentService();
    try {
      await service.deleteAppointment(_reminders[index]['id']);
      setState(() {
        _reminders.removeAt(index);
      });
    } catch (e) {
      // Handle error
      print(e);
    }
  }

  void _updateReminder(
      String appointmentId, DateTime date, TimeOfDay time) async {
    final service = AppointmentService();
    try {
      await service.updateAppointment(
        appointmentId: appointmentId,
        date: DateFormat('yyyy-MM-dd').format(date),
        userId: 'userId', // Replace with actual user ID
        doctorId: 'doctorId', // Replace with actual doctor ID
      );
      // Update UI if needed
    } catch (e) {
      // Handle error
      print(e);
    }
  }

  void _updateSelectedDate(DateTime date) {
    setState(() {
      _selectedDate = date;
    });
  }

void _showAddReminderBottomSheet() {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.white,
    isScrollControlled: true,
    builder: (BuildContext context) {
      return AddReminderBottomSheet(
        onAddReminder: (DateTime date, TimeOfDay time, String repeatOption) {
          _addReminder(date, time);
          setState(() {
            _repeatOption = repeatOption;
          });
        },
      );
    },
  );
}

  List<Widget> _buildDateCards() {
    List<Widget> dateCards = [];
    for (int i = -2; i <= 2; i++) {
      DateTime date = _selectedDate.add(Duration(days: i));
      dateCards.add(
        Expanded(
          child: Card(
            color: i == 0 ? orangeAccent : Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    DateFormat.d().format(date),
                    style: TextStyle(
                      fontSize: 24,
                      color: i == 0 ? Colors.white : Colors.black,
                    ),
                  ),
                  Text(
                    DateFormat.E().format(date),
                    style: TextStyle(
                      fontSize: 16,
                      color: i == 0 ? Colors.white : Colors.black,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }
    return dateCards;
  }

  @override
  @override
Widget build(BuildContext context) {
  return Consumer<LanguageProvider>(
    builder: (context, languageProvider, child) {
      DateTime today = DateTime.now();
      List<Map<String, dynamic>> todaysReminders = _reminders
          .where((reminder) =>
              reminder['date'].year == _selectedDate.year &&
              reminder['date'].month == _selectedDate.month &&
              reminder['date'].day == _selectedDate.day)
          .toList();

      List<Map<String, dynamic>> futureReminders = _reminders
          .where((reminder) =>
              reminder['date'].isAfter(_selectedDate) ||
              (reminder['date'].year == _selectedDate.year &&
                  reminder['date'].month == _selectedDate.month &&
                  reminder['date'].day > _selectedDate.day))
          .toList();

      return Stack(
        children: [
          MainBackground(),
          Scaffold(
            backgroundColor: Colors.transparent,
            appBar: BacknavAppBar(),
            body: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          languageProvider.translate('reminders'),
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.calendar_today, size: 24.0),
                          onPressed: () async {
                            DateTime? selectedDate = await showDatePicker(
                              context: context,
                              initialDate: _selectedDate,
                              firstDate: DateTime(2000),
                              lastDate: DateTime(2101),
                            );
                            if (selectedDate != null) {
                              _updateSelectedDate(selectedDate);
                            }
                          },
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    Row(
                      children: _buildDateCards(),
                    ),
                    SizedBox(height: 10),
                    Text(
                      languageProvider.translate('today_reminders'),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 10),
                    if (todaysReminders.isNotEmpty) ...[
                      ...todaysReminders.map((reminder) {
                        return ListTile(
                          title: Text(
                            '${languageProvider.translate('reminder')} ${DateFormat.jm().format(DateTime(
                              reminder['date'].year,
                              reminder['date'].month,
                              reminder['date'].day,
                              reminder['time'].hour,
                              reminder['time'].minute,
                            ))}',
                            style: TextStyle(color: Colors.blue),
                          ),
                          trailing: IconButton(
                            icon: Icon(Icons.delete, color: Colors.red),
                            onPressed: () =>
                                _removeReminder(_reminders.indexOf(reminder)),
                          ),
                        );
                      }).toList(),
                    ] else ...[
                      Text(languageProvider.translate('no_reminders'), style: TextStyle(color: Colors.grey)),
                    ],
                    SizedBox(height: 20),
                    Text(
                      languageProvider.translate('upcoming_reminders'),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 10),
                    if (futureReminders.isNotEmpty) ...[
                      ...futureReminders.map((reminder) {
                        return ListTile(
                          title: Text(
                            '${languageProvider.translate('reminder')} ${DateFormat.yMMMd().format(reminder['date'])} ${reminder['time'].format(context)}',
                            style: TextStyle(color: Colors.blue),
                          ),
                          trailing: IconButton(
                            icon: Icon(Icons.delete, color: Colors.red),
                            onPressed: () =>
                                _removeReminder(_reminders.indexOf(reminder)),
                          ),
                        );
                      }).toList(),
                    ] else ...[
                      Text(languageProvider.translate('no_reminders'), style: TextStyle(color: Colors.grey)),
                    ],
                  ],
                ),
              ),
            ),
            floatingActionButton: ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                backgroundColor: orangeAccent,
              ),
              onPressed: _showAddReminderBottomSheet,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.add_circle_outline, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    languageProvider.translate('reminder'),
                    style: TextStyle(color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    },
  );
}
}
