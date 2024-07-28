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
  List<Map<String, dynamic>> _reminders = [];
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  bool _showDatePicker = false;
  bool _showTimePicker = false;
  String _repeatOption = 'Never';

  @override
  void initState() {
    super.initState();
    _firstName = _authService.getFirstName() ?? 'User';
  }

  void _addReminder(DateTime date, TimeOfDay time) {
    setState(() {
      _reminders.add({
        'date': date,
        'time': time,
        'repeatDays': _repeatOption,
      });
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Reminder added!'),
        behavior: SnackBarBehavior.floating, // Makes the Snackbar floating
        margin: EdgeInsets.symmetric(
            horizontal: 16, vertical: 20), // Adds padding around the Snackbar
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  void _removeReminder(int index) {
    setState(() {
      _reminders.removeAt(index);
    });
  }

  Future<void> _showAddReminderBottomSheet() async {
    DateTime reminderDate = DateTime.now();
    TimeOfDay reminderTime = TimeOfDay.now();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: Text('Discard Changes?'),
                                  content: Text(
                                      'Are you sure you want to discard changes?'),
                                  actions: [
                                    TextButton(
                                      child: Text('Cancel'),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                    ),
                                    TextButton(
                                      child: Text('Discard Changes',
                                          style: TextStyle(color: Colors.red)),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                        Navigator.of(context)
                                            .pop(); // Close the BottomSheet
                                      },
                                    ),
                                  ],
                                );
                              },
                            );
                          },
                          child: Text('Cancel'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            _addReminder(reminderDate, reminderTime);
                            Navigator.of(context)
                                .pop(); // Close the BottomSheet
                          },
                          child: Text('Apply'),
                        ),
                      ],
                    ),
                    Divider(),
                    SwitchListTile(
                      title: Text('Date'),
                      value: _showDatePicker,
                      onChanged: (bool value) {
                        setState(() {
                          _showDatePicker = value;
                          if (value) {
                            _showTimePicker =
                                false; // Ensure only one picker is shown at a time
                          }
                        });
                      },
                    ),
                    if (_showDatePicker)
                      Column(
                        children: [
                          SizedBox(height: 10),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            child: CalendarDatePicker(
                              initialDate: reminderDate,
                              firstDate: DateTime(2000),
                              lastDate: DateTime(2101),
                              onDateChanged: (DateTime date) {
                                setState(() {
                                  reminderDate = date;
                                });
                              },
                            ),
                          ),
                        ],
                      ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Container(
                          padding: EdgeInsets.only(left: 15),
                          child: Text(
                            style: TextStyle(color: Colors.red),
                            '${DateFormat.yMd().format(reminderDate)}',
                          ),
                        )
                      ],
                    ),
                    Divider(),
                    SwitchListTile(
                      title: Text('Time'),
                      value: _showTimePicker,
                      onChanged: (bool value) {
                        setState(() {
                          _showTimePicker = value;
                          if (value) {
                            _showDatePicker =
                                false; // Ensure only one picker is shown at a time
                          }
                        });
                      },
                    ),
                    if (_showTimePicker)
                      Column(
                        children: [
                          SizedBox(height: 10),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ElevatedButton(
                                  onPressed: () async {
                                    final TimeOfDay? pickedTime =
                                        await showTimePicker(
                                      context: context,
                                      initialTime: reminderTime,
                                    );
                                    if (pickedTime != null) {
                                      setState(() {
                                        reminderTime = pickedTime;
                                      });
                                    }
                                  },
                                  child: Text('Select Time'),
                                ),
                                SizedBox(width: 10),
                              ],
                            ),
                          ),
                        ],
                      ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Container(
                          padding: EdgeInsets.only(left: 15),
                          child: Text(
                            style: TextStyle(color: Colors.red),
                            '${reminderTime.format(context)}',
                          ),
                        )
                      ],
                    ),
                    Divider(),
                    Text('Repeat: $_repeatOption'),
                    ElevatedButton(
                      onPressed: () async {
                        final String? selectedOption = await showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: Text('Repeat Options'),
                              content: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  ListTile(
                                    title: Text('Daily'),
                                    onTap: () =>
                                        Navigator.of(context).pop('Daily'),
                                  ),
                                  ListTile(
                                    title: Text('Weekends'),
                                    onTap: () =>
                                        Navigator.of(context).pop('Weekends'),
                                  ),
                                  ListTile(
                                    title: Text('Weekdays'),
                                    onTap: () =>
                                        Navigator.of(context).pop('Weekdays'),
                                  ),
                                  ListTile(
                                    title: Text('Never'),
                                    onTap: () =>
                                        Navigator.of(context).pop('Never'),
                                  ),
                                ],
                              ),
                            );
                          },
                        );
                        if (selectedOption != null) {
                          setState(() {
                            _repeatOption = selectedOption;
                          });
                        }
                      },
                      child: Text('Select Repeat Option'),
                    ),
                  ],
                ),
              ),
            );
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Reminders",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Row(
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(
                                  right: 5), // Adjust padding here
                              child: Text(
                                DateFormat.MMMM().format(_selectedDate),
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: Icon(Icons.calendar_today),
                              onPressed: () => _selectDate(context),
                            ),
                          ],
                        ),
                      ],
                    ),
                    SizedBox(height: 20),
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
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 20),
                    Column(
                      children: _reminders.map((reminder) {
                        return Card(
                          margin: EdgeInsets.symmetric(vertical: 8),
                          child: ListTile(
                            contentPadding: EdgeInsets.all(16),
                            title: Text(
                              '${DateFormat.yMd().format(reminder['date'])} at ${reminder['time'].format(context)}',
                              style: TextStyle(fontSize: 16),
                            ),
                            subtitle: Text('Repeat: ${reminder['repeatDays']}'),
                            trailing: IconButton(
                              icon: Icon(Icons.delete, color: Colors.red),
                              onPressed: () {
                                _removeReminder(_reminders.indexOf(reminder));
                              },
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddReminderBottomSheet,
        child: Icon(Icons.add_circle_outline, color: Colors.white),
        backgroundColor: Colors.orangeAccent,
        tooltip: 'Add Reminder',
      ),
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }
}
