import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:meddymobile/utils/languages.dart';
import 'package:provider/provider.dart';
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
    return Consumer<LanguageProvider>(
    builder: (context, languageProvider, child) {
        return Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(languageProvider.translate('date')),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _showDatePicker = !_showDatePicker;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                  backgroundColor: lightPurple, 
                  foregroundColor: Colors.black, 
                ),
                  child: Text('${DateFormat.yMd().format(selectedDate)}'),
                ),
              ],
            ),
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
    );}

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
    return Consumer<LanguageProvider>(
    builder: (context, languageProvider, child) {
    return Column(
      children: [
        Container(
          padding: EdgeInsets.symmetric(vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(languageProvider.translate('time')),
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
                style: ElevatedButton.styleFrom(
              backgroundColor: lightPurple, 
              foregroundColor: Colors.black, 
            ),
                child: Text('${selectedTime.format(context)}'),
              ),
            ],
          ),
        ),
        
      ],
    );
  },);}
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
  String _repeatOption = 'never';
  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
    builder: (context, languageProvider, child) {
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
                  child: Text(languageProvider.translate('cancel')),
                ),
                ElevatedButton(
                  onPressed: () {
                    widget.onAddReminder(reminderDate, reminderTime, _repeatOption);
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: orangeAccent,
                    foregroundColor: Colors.white,
                  ),
                  child: Text(languageProvider.translate('apply')),
                ),
              ],
            ),
            SizedBox(height: 12),
            Divider(),
            SizedBox(height: 12),
            TextFormField(
              initialValue: languageProvider.translate('new_reminder'),
              decoration: InputDecoration(
                labelText: languageProvider.translate('reminder_title'),
              ),
            ),
            SizedBox(height: 12),
            DatePickerWidget(
              initialDate: reminderDate,
              onDateChanged: (DateTime date) {
                setState(() {
                  reminderDate = date;
                });
              },
            ),
            SizedBox(height: 12),
            Divider(),
            SizedBox(height: 8),
            TimePickerWidget(
              selectedTime: reminderTime,
              onTimeChanged: (TimeOfDay time) {
                setState(() {
                  reminderTime = time;
                });
              },
            ),
            SizedBox(height: 8),
            Divider(),
            SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(languageProvider.translate('repeat')),
                ElevatedButton(
                  onPressed: () => _showRepeatOptionsDialog(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: lightPurple,
                    foregroundColor: Colors.black,
                  ),
                  child: Text(languageProvider.translate(_repeatOption)),
                ),
              ],
            ),
          ],
        ),
      ),
    );},);
  }


  void _showDiscardChangesDialog(BuildContext context) {
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Consumer<LanguageProvider>(
        builder: (context, languageProvider, child) {
        return AlertDialog(
          title: Text(languageProvider.translate('discard_changes_q')),
          content: Text(languageProvider.translate('are_you_sure')),
          actions: [
            TextButton(
              child: Text(languageProvider.translate('cancel')),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text(languageProvider.translate('discard_changes'), style: TextStyle(color: Colors.red)),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
            ),
          ],
        );},);
      },
    );
  }

  void _showRepeatOptionsDialog(BuildContext context) async {
    final String? selectedOption = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return Consumer<LanguageProvider>(
        builder: (context, languageProvider, child) {
        return AlertDialog(
          title: Text(languageProvider.translate('repeat_options')),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: Text(languageProvider.translate('daily')),
                onTap: () => Navigator.of(context).pop(languageProvider.translate('daily')),
              ),
              ListTile(
                title: Text(languageProvider.translate('weekends')),
                onTap: () => Navigator.of(context).pop(languageProvider.translate('weekends')),
              ),
              ListTile(
                title: Text(languageProvider.translate('weekdays')),
                onTap: () => Navigator.of(context).pop(languageProvider.translate('weekdays')),
              ),
              ListTile(
                title: Text(languageProvider.translate('never')),
                onTap: () => Navigator.of(context).pop(languageProvider.translate('never')),
              ),
            ],
          ),
        );},);
      },
    );
    if (selectedOption != null) {
      setState(() {
        _repeatOption = selectedOption;
      });
    }
  }
}