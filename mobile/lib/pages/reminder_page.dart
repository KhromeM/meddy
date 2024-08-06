import 'package:flutter/material.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/main_background.dart';
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
  late Future<void> _appointmentsFuture = new Future<void>(() => ());
  Map<String, dynamic> _appointments = Map();
  @override
  void initState() {
    super.initState();
    _firstName = _authService.getFirstName() ?? 'User';
    _appointmentsFuture = _fetchAppointments();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _refreshAppointments();
  }

  Future<void> _fetchAppointments() async {
    final service = AppointmentService();
    String? user = await _authService.getIdToken();

    try {
      _appointments = await service.getAllAppointments();
      setState(() {}); // Trigger a rebuild after fetching
    } catch (e) {
      print(e);
    }
  }

  Future<void> _refreshAppointments() async {
    setState(() {
      _appointmentsFuture = _fetchAppointments();
    });
    return _appointmentsFuture;
  }

  void _addReminder(DateTime date, TimeOfDay time) async {
    final service = AppointmentService();
    String? user = await _authService.getIdToken();

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/info/reminder'),
        headers: {'Content-Type': 'application/json', 'idToken': 'dev'},
        body: jsonEncode({
          'date': DateFormat('yyyy-MM-dd').format(date),
          'userId': user,
        }),
      );
      _refreshAppointments(); // Refresh after adding
    } catch (e) {
      print(e);
    }
  }

  void _removeReminder(int id) async {
    final service = AppointmentService();
    try {
      final response = await http.delete(
          Uri.parse('$baseUrl/info/reminder/$id'),
          headers: {'idToken': 'dev'});
      setState(() {});
      print(response.body);
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

  List<Widget> _buildReminders() {
    List<Widget> reminderCards = [];
    _appointments.forEach((key, value) {
      for (var reminder in value) {
        String fullTime = reminder['time'];
        int? repeat = reminder['hoursuntilrepeat'];
        String repeat_text =
            repeat == 24 || repeat == null ? 'Once a day' : 'Every $repeat hs';
        reminderCards.add(Card(
            color: lightGreen,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Text(
                          reminder['medicationname'],
                          style: TextStyle(fontSize: 20, color: Colors.black),
                        ),
                        SizedBox(width: 15),
                        Text(
                          fullTime.substring(0, fullTime.length - 3),
                          style: TextStyle(fontSize: 18, color: Colors.black),
                        ),
                        SizedBox(width: 15),
                        Text(
                          repeat_text,
                          style: TextStyle(fontSize: 18, color: Colors.black),
                        ),
                      ],
                    ),
                    IconButton(
                        icon: Icon(Icons.delete, color: Colors.red),
                        onPressed: () => {
                              print(reminder['reminderid']),
                              _removeReminder(reminder['reminderid']),
                              _fetchAppointments()
                            }),
                  ]),
            )));
      }
    });
    return reminderCards;
  }

  @override
  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Stack(
          children: [
            MainBackground(),
            Scaffold(
              extendBodyBehindAppBar: true,
              backgroundColor: Colors.transparent,
              appBar: AppBar(
                backgroundColor: Colors.transparent,
                forceMaterialTransparency: true,
              ),
              body: RefreshIndicator(
                onRefresh: _refreshAppointments,
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                            height: MediaQuery.of(context).size.height * 0.1),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              languageProvider.translate('reminders'),
                              style: TextStyle(
                                  fontSize: 24, fontWeight: FontWeight.bold),
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
                        Row(children: _buildDateCards()),
                        SizedBox(height: 10),
                        Text(
                          languageProvider.translate('upcoming_reminders'),
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 10),
                        FutureBuilder(
                          future: _appointmentsFuture,
                          builder: (context, snapshot) {
                            if (snapshot.connectionState ==
                                ConnectionState.waiting) {
                              return CircularProgressIndicator();
                            } else if (snapshot.hasError) {
                              return Text('Error: ${snapshot.error}');
                            } else {
                              return Column(
                                children: _appointments.isNotEmpty
                                    ? _buildReminders()
                                    : [
                                        Text(
                                            languageProvider
                                                .translate('no_reminders'),
                                            style:
                                                TextStyle(color: Colors.grey))
                                      ],
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              floatingActionButton: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                  backgroundColor: orangeAccent,
                ),
                onPressed: _showAddReminderBottomSheet,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.add_circle_outline, color: Colors.white),
                    SizedBox(width: 8),
                    Text(languageProvider.translate('reminder'),
                        style: TextStyle(color: Colors.white)),
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
