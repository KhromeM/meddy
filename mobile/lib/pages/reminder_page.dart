import 'package:aura_box/aura_box.dart';
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/material_symbols_icons.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/services/appointment_service.dart';
import 'package:meddymobile/utils/languages.dart';
import 'package:motion/motion.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/services.dart';

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
  String? userId;

  @override
  void initState() {
    super.initState();
    _firstName = _authService.getFirstName() ?? 'User';
    _appointmentsFuture = _fetchAppointments();
  }

  Future<void> _initializeReminderPage() async {
    // Fetch the user ID and store it in the class-level variable
    userId = await _authService.getIdToken();

    // Fetch the user's first name
    _firstName = _authService.getFirstName() ?? 'User';

    // Fetch and refresh appointments
    _appointmentsFuture = _fetchAppointments();

    setState(() {}); // Trigger a rebuild to update the UI with fetched data
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _refreshAppointments();
  }

  Future<void> _fetchAppointments() async {
    final service = AppointmentService();
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

  void _removeReminder(int id) async {
    String? user = await _authService.getIdToken();
    try {
      final response = await http.delete(
          Uri.parse('$baseUrl/info/reminder/$id'),
          headers: {'idToken': userId!});
      _refreshAppointments(); // Refresh after removing
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

  List<Widget> _buildDateCards() {
    List<Widget> dateCards = [];
    for (int i = -2; i <= 2; i++) {
      DateTime date = _selectedDate.add(Duration(days: i));
      dateCards.add(
        Expanded(
          child: Card(
            color: i == 0 ? Color(0xFF0E3C26) : Colors.white,
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
        reminderCards.add(Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            width: MediaQuery.of(context).size.width * 0.95,
            decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.rectangle,
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(color: Color(0xFF0E3C26)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    spreadRadius: 0,
                    blurRadius: 10,
                    offset: Offset(7, 7), // changes position of shadow
                  ),
                ]),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child:
                  Column(mainAxisAlignment: MainAxisAlignment.start, children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(left: 20.0),
                      child: Row(
                        children: [
                          Text(
                            'One ',
                            style: TextStyle(fontSize: 20),
                          ),
                          Text(
                            'capsule',
                            style: TextStyle(fontSize: 20),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(right: 10.0),
                      child: IconButton(
                          icon: Icon(
                            Icons.close,
                            color: Colors.redAccent,
                            size: 30,
                          ),
                          onPressed: () => {
                                print(reminder['reminderid']),
                                _removeReminder(reminder['reminderid']),
                                _fetchAppointments()
                              }),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 20),
                  child: Row(
                    children: [
                      Text(
                        reminder['medicationname'],
                        style: TextStyle(
                            fontSize: 20,
                            color: Color(0xFF0E3C26),
                            fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 10),
                Padding(
                  padding: const EdgeInsets.only(left: 20.0),
                  child: Row(
                    children: [
                      Text(
                        fullTime.substring(0, fullTime.length - 3),
                        style:
                            TextStyle(fontSize: 18, color: Color(0xFF0E3C26)),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 10),
                Padding(
                  padding: const EdgeInsets.only(left: 20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        repeat_text,
                        style:
                            TextStyle(fontSize: 18, color: Color(0xFF0E3C26)),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(right: 20.0),
                        child: Icon(
                          Symbols.pill,
                          size: 40,
                        ),
                      )
                    ],
                  ),
                ),
                SizedBox(height: 10),
              ]),
            ),
          ),
        ));
      }
    });
    return reminderCards;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Stack(
          children: [
            //MainBackground(),
            Scaffold(
              extendBodyBehindAppBar: true,
              backgroundColor: Colors.transparent,
              appBar: AppBar(
                  backgroundColor: Colors.transparent,
                  forceMaterialTransparency: true,
                  systemOverlayStyle: SystemUiOverlayStyle(
                    statusBarColor: Colors.transparent,
                    statusBarIconBrightness: Brightness.dark,
                    statusBarBrightness: Brightness.light,
                  )),
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
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                languageProvider.translate('reminders'),
                                style: TextStyle(
                                    fontSize: 24, fontWeight: FontWeight.bold),
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
                        Row(children: _buildDateCards()),
                        SizedBox(height: 10),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            languageProvider.translate('upcoming_reminders'),
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold),
                          ),
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
            ),
          ],
        );
      },
    );
  }
}
