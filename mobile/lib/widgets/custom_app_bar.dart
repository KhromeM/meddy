import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/pages/health_page.dart';
import 'package:meddymobile/pages/reminder_page.dart';
import 'package:meddymobile/providers/chat_provider.dart'; // Ensure you import the ChatProvider
import 'package:meddymobile/utils/app_colors.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/pages/signin_page.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CustomAppBar extends StatefulWidget implements PreferredSizeWidget {
  @override
  _CustomAppBarState createState() => _CustomAppBarState();

  @override
  Size get preferredSize => Size.fromHeight(56.0);
}

class _CustomAppBarState extends State<CustomAppBar> {
  final AuthService _authService = AuthService();
  String _firstName = 'User';
  String? _profileImageUrl;
  String _currentLanguage = 'English';
  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    final firstName = _authService.getFirstName();
    final profileImageUrl = _authService.getProfileImageUrl();
    setState(() {
      _firstName = firstName ?? 'User';
      _profileImageUrl = profileImageUrl;
    });
  }

  Future<void> _logout(BuildContext context) async {
    try {
      await _authService.signOut();
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const SignInPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error logging out: $e')),
      );
    }
  }

  Future<void> _showBottomSheet(BuildContext context) async {
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.6,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildGreetingText(),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: _buildSquareButton(
                      'Reminders',
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const ReminderPage()),
                        );
                      },
                    ),
                  ),
                  SizedBox(width: 20),
                  Expanded(
                    child: _buildSquareButton(
                      'Health',
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => HealthPage()),
                        );
                      },
                    ),
                  ),
                ],
              ),
              Spacer(),
              _buildLogoutButton(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGreetingText() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hi, $_firstName',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'How may I assist you today?',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        if (_profileImageUrl != null)
          CircleAvatar(
            radius: 30,
            backgroundImage: NetworkImage(_profileImageUrl!),
          ),
      ],
    );
  }

  Widget _buildSquareButton(String text, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: lightPurple,
        foregroundColor: Colors.black,
        padding: EdgeInsets.only(top: 130),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25),
        ),
        elevation: 0,
      ),
      child: Align(
        alignment: Alignment.bottomLeft,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(
              15, 8.0, 8.0, 10), // Increase the bottom padding
          child: Text(
            text,
            style: TextStyle(fontSize: 25, fontWeight: FontWeight.w600),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: ElevatedButton(
          onPressed: () => _logout(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
            padding: EdgeInsets.symmetric(vertical: 20),
            alignment: Alignment.centerLeft,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: BorderSide(
                color: Colors.black,
                width: 3,
              ),
            ),
            elevation: 0,
          ),
          child: Center(
            child: Text(
              'Logout',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: InkWell(
        onTap: () {
          _showBottomSheet(context);
        },
        child: Padding(
          padding:
              const EdgeInsets.only(left: 14.0, top: 0, bottom: 0, right: 0),
          child: SvgPicture.asset(
            'assets/images/logo_image.svg',
            fit: BoxFit.contain,
          ),
        ),
      ),
      actions: [
        InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) =>
                    Provider.of<ChatProvider>(context, listen: false).isLoading
                        ? Scaffold(
                            body: Center(child: CircularProgressIndicator()))
                        : ChatPage(),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.only(right: 10),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(
                  Icons.circle,
                  size: 60,
                  color: Colors.black,
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: FaIcon(
                    FontAwesomeIcons.penToSquare,
                    size: 20,
                    color: Colors.white,
                  ),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }
Widget _buildLanguageSelector(StateSetter bottomSheetSetState) {
  return StatefulBuilder(
    builder: (BuildContext context, StateSetter setState) {
      return GestureDetector(
        child: Container(
          width: 80,
          height: 80,
          child: Stack(
            alignment: Alignment.center,
            children: [
              Image.asset(
                _currentLanguage == 'English' 
                  ? 'assets/images/us-flag.png'
                  : 'assets/images/spanish-flag.png',
                width: 60,
                height: 60,
                fit: BoxFit.contain,
              ),
            ],
          ),
        ),
        onTap: () {
          setState(() {
            _currentLanguage = _currentLanguage == 'English' ? 'Español' : 'English';
          });
          bottomSheetSetState(() {}); // Force bottom sheet to rebuild
          print(_currentLanguage);
        },
      );
    },
  );
}
}