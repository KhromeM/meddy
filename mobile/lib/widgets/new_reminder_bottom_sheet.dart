import 'package:flutter/material.dart';
import 'package:intl/intl.dart';


class DatePickerWidget extends StatefulWidget {
  final DateTime initialDate;
  final Function(DateTime) onDateChanged;

  const DatePickerWidget({
    Key? key,
    required this.initialDate,
    required this.onDateChanged,
  }) : super(key: key);

  @override
  _DatePickerWidgetState createState() => _DatePickerWidgetState();
}

class _DatePickerWidgetState extends State<DatePickerWidget> {
  late DateTime selectedDate;
  bool _showDatePicker = false;

  @override
  void initState() {
    super.initState();
    selectedDate = widget.initialDate;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Date: '),
            SizedBox(width: 10),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _showDatePicker = !_showDatePicker;
                });
              },
              child: Text('${DateFormat.yMd().format(selectedDate)}'),
            ),
          ],
        ),
        SizedBox(height: 10),
        if (_showDatePicker)
          Container(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: CalendarDatePicker(
              initialDate: selectedDate,
              firstDate: DateTime(2000),
              lastDate: DateTime(2101),
              onDateChanged: (DateTime date) {
                setState(() {
                  selectedDate = date;
                  _showDatePicker = false;
                });
                widget.onDateChanged(date);
              },
            ),
          ),
      ],
    );
  }
}

class TimePickerWidget extends StatelessWidget {
  final TimeOfDay selectedTime;
  final Function(TimeOfDay) onTimeChanged;

  const TimePickerWidget({
    Key? key,
    required this.selectedTime,
    required this.onTimeChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(height: 10),
        Container(
          padding: EdgeInsets.symmetric(vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Time: '),
              SizedBox(width: 10),
              ElevatedButton(
                onPressed: () async {
                  final TimeOfDay? pickedTime = await showTimePicker(
                    context: context,
                    initialTime: selectedTime,
                  );
                  if (pickedTime != null) {
                    onTimeChanged(pickedTime);
                  }
                },
                child: Text('${selectedTime.format(context)}'),
              ),
              SizedBox(width: 10),
            ],
          ),
        ),
        
      ],
    );
  }
}

class AddReminderBottomSheet extends StatefulWidget {
  final Function(DateTime, TimeOfDay, String) onAddReminder;

  const AddReminderBottomSheet({Key? key, required this.onAddReminder}) : super(key: key);

  @override
  _AddReminderBottomSheetState createState() => _AddReminderBottomSheetState();
}

class _AddReminderBottomSheetState extends State<AddReminderBottomSheet> {
  DateTime reminderDate = DateTime.now();
  TimeOfDay reminderTime = TimeOfDay.now();
  bool _showDatePicker = false;
  String _repeatOption = 'Never';

  @override
  Widget build(BuildContext context) {
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
                  onPressed: () => _showDiscardChangesDialog(context),
                  child: Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    widget.onAddReminder(reminderDate, reminderTime, _repeatOption);
                    Navigator.of(context).pop();
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


              DatePickerWidget(
                initialDate: reminderDate,
                onDateChanged: (DateTime date) {
                  setState(() {
                    reminderDate = date;
                  });
                },
              ),
            Divider(),
            

              TimePickerWidget(
                selectedTime: reminderTime,
                onTimeChanged: (TimeOfDay time) {
                  setState(() {
                    reminderTime = time;
                  });
                },
              ),
            Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Repeat: '),
              SizedBox(width: 10), // Adds 10 pixels of space between the text and button
              ElevatedButton(
                onPressed: () => _showRepeatOptionsDialog(context),
                child: Text(_repeatOption),
              ),
            ],
          ),
          ],
        ),
      ),
    );
  }

  void _showDiscardChangesDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Discard Changes?'),
          content: Text('Are you sure you want to discard changes?'),
          actions: [
            TextButton(
              child: Text('Cancel'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text('Discard Changes', style: TextStyle(color: Colors.red)),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _showRepeatOptionsDialog(BuildContext context) async {
    final String? selectedOption = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Repeat Options'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: Text('Daily'),
                onTap: () => Navigator.of(context).pop('Daily'),
              ),
              ListTile(
                title: Text('Weekends'),
                onTap: () => Navigator.of(context).pop('Weekends'),
              ),
              ListTile(
                title: Text('Weekdays'),
                onTap: () => Navigator.of(context).pop('Weekdays'),
              ),
              ListTile(
                title: Text('Never'),
                onTap: () => Navigator.of(context).pop('Never'),
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
  }
}