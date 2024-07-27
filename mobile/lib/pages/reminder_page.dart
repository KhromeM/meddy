import 'package:flutter/material.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/backnav_app_bar.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:percent_indicator/percent_indicator.dart';

class ReminderPage extends StatefulWidget {
  const ReminderPage({super.key});

  @override
  _ReminderPageState createState() => _ReminderPageState();
}

class _ReminderPageState extends State<ReminderPage> {
  final AuthService _authService = AuthService();
  late String _firstName;
  List<String> _reminders = [];
  DateTime _selectedDate = DateTime.now();
  String _selectedDateStr = DateFormat('yyyy-MM-dd').format(DateTime.now());

  @override
  void initState() {
    super.initState();
    _firstName = _authService.getFirstName() ?? 'User';
  }

  void _addReminder() {
    setState(() {
      _reminders.add('Reminder ${_reminders.length + 1}');
    });
  }

  void _removeReminder(int index) {
    setState(() {
      _reminders.removeAt(index);
    });
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
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
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
                    Center(
                      child: Text(
                        "$_firstName's Reminders",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Divider(
                      color: Colors.black,
                      thickness: 1,
                    ),
                    SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButton<String>(
                            value: _selectedDateStr,
                            items: <String>[
                              DateFormat('yyyy-MM-dd').format(DateTime.now()),
                              DateFormat('yyyy-MM-dd').format(
                                  DateTime.now().add(Duration(days: 1))),
                              DateFormat('yyyy-MM-dd').format(
                                  DateTime.now().add(Duration(days: 2))),
                              DateFormat('yyyy-MM-dd').format(
                                  DateTime.now().add(Duration(days: 3))),
                            ].map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(value),
                              );
                            }).toList(),
                            onChanged: (String? newValue) {
                              setState(() {
                                _selectedDateStr = newValue!;
                                _selectedDate =
                                    DateFormat('yyyy-MM-dd').parse(newValue);
                              });
                            },
                          ),
                        ),
                        SizedBox(width: 10),
                        ElevatedButton(
                          onPressed: _addReminder,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color.fromRGBO(37, 150, 190, 1),
                          ),
                          child: Text('Add Reminder'),
                        ),
                      ],
                    ),
                    Divider(
                      color: Colors.black,
                      thickness: 1,
                    ),
                    SizedBox(height: 20),
                    // Ensure the Row widget contains the Expanded widgets correctly
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: _buildDateCards(),
                    ),
                    SizedBox(height: 40),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Tasks',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        LinearPercentIndicator(
                          width: 100.0,
                          lineHeight: 8.0,
                          percent: 0.9,
                          progressColor: Colors.green,
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    ListView.builder(
                      shrinkWrap: true,
                      itemCount: _reminders.length,
                      itemBuilder: (context, index) {
                        return Dismissible(
                          key: Key(_reminders[index]),
                          direction: DismissDirection.endToStart,
                          onDismissed: (direction) {
                            _removeReminder(index);
                          },
                          background: Container(
                            color: Colors.red,
                            alignment: Alignment.centerRight,
                            padding: EdgeInsets.symmetric(horizontal: 20),
                            child: Icon(Icons.delete, color: Colors.white),
                          ),
                          child: ListTile(title: Text(_reminders[index])),
                        );
                      },
                    ),
                    SizedBox(height: 10),
                    SizedBox(height: 40),
                    Text(
                      'Upcoming Appointments',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    _buildAppointmentList(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppointmentList() {
    List<Map<String, String>> appointments = [
      {'title': 'Appointment 1', 'time': '10:00 AM'},
      {'title': 'Appointment 2', 'time': '2:00 PM'},
      {'title': 'Appointment 3', 'time': '4:00 PM'},
    ];

    return ListView.builder(
      shrinkWrap: true,
      itemCount: appointments.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: Text(appointments[index]['title']!),
          subtitle: Text(appointments[index]['time']!),
        );
      },
    );
  }
}
