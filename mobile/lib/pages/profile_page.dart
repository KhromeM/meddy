import 'package:flutter/material.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/pages/signin_page.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/backnav_app_bar.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final AuthService _authService = AuthService();
  late String _firstName;
  late String _profileImageUrl;
  List<String> _reminders = [];
  bool _isLoading = false; // Loading state

  @override
  void initState() {
    super.initState();
    _firstName = _authService.getFirstName() ?? 'User';
    _profileImageUrl =
        _authService.getProfileImageUrl() ?? 'assets/images/def_pfp.svg';
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

  Future<void> _logout() async {
    setState(() {
      _isLoading = true; // Set loading state to true
    });
    try {
      await _authService.signOut();
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const SignInPage()),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error logging out: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false; // Set loading state to false
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          MainBackground(), // Using MainBackground widget
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
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundImage: NetworkImage(_profileImageUrl),
                        ),
                        SizedBox(width: 16),
                        Text(
                          _firstName,
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    SizedBox(height: 40),
                    Text(
                      'Reminders',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    // List of reminders with swipe to delete functionality
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
                    // Add reminder button
                    ElevatedButton(
                      onPressed: _addReminder,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color.fromRGBO(37, 150, 190, 1),
                      ),
                      child: Text('Add Reminder'),
                    ),
                    SizedBox(height: 40),
                    Text(
                      'Upcoming Appointments',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    // List of appointments
                    _buildAppointmentList(),
                  ],
                ),
              ),
            ),
            bottomNavigationBar: Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                onPressed:
                    _isLoading ? null : _logout, // Disable button while loading
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading
                    ? CircularProgressIndicator() // Show loading indicator
                    : Text(
                        'Logout',
                        style: TextStyle(color: Colors.white, fontSize: 16),
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
