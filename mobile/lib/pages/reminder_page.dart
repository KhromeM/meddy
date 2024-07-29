import 'package:flutter/material.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/backnav_app_bar.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/services/appointment_service.dart';

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
    _fetchAppointments();
  }

  void _fetchAppointments() async {
    final service = AppointmentService();
    try {
      final appointments = await service.getAppointmentsByDate(
        DateFormat('yyyy-MM-dd').format(_selectedDate),
      );
      // Update _reminders with fetched appointments
      setState(() {
        _reminders = appointments
            .map((app) => {
                  'date': DateTime.parse(app['date']),
                  'time': TimeOfDay.fromDateTime(DateTime.parse(app['date'])),
                  'repeatDays': app['repeatDays'] ?? 'Never',
                })
            .toList();
      });
    } catch (e) {
      // Handle error
      print(e);
    }
  }

  void _addReminder(DateTime date, TimeOfDay time) async {
    final service = AppointmentService();
    try {
      await service.createAppointment(
        date: DateFormat('yyyy-MM-dd').format(date),
        userId: 'userId', // Replace with actual user ID
        doctorId: 'doctorId', // Replace with actual doctor ID
      );
      // Update UI
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
          behavior: SnackBarBehavior.floating,
          margin: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
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
                    TextFormField(
                      initialValue: 'New Reminder',
                      decoration: InputDecoration(
                        labelText: 'Reminder Title',
                      ),
                    ),
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
                        'Reminders',
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
// Today's Reminders Section
                  Text(
                    'Today\'s Reminders',
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
                          'Reminder at ${DateFormat.jm().format(DateTime(
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
                    Text('No reminders!', style: TextStyle(color: Colors.grey)),
                  ],
                  SizedBox(height: 20),
// Upcoming Reminders Section
                  Text(
                    'Upcoming Reminders',
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
                          'Reminder on ${DateFormat.yMMMd().format(reminder['date'])} at ${reminder['time'].format(context)}',
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
                    Text('No reminders!', style: TextStyle(color: Colors.grey)),
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
              backgroundColor: Colors.orangeAccent,
            ),
            onPressed: _showAddReminderBottomSheet,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.add_circle_outline, color: Colors.white),
                SizedBox(width: 8),
                Text(
                  'Reminder',
                  style: TextStyle(color: Colors.white),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
