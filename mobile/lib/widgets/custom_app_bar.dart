import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:meddymobile/utils/app_colors.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/pages/signin_page.dart';

import 'package:meddymobile/utils/languages.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import 'package:meddymobile/widgets/spinning_logo.dart';

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
  final ValueNotifier<double> _speedNotifier = ValueNotifier<double>(0.3);

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
      Navigator.of(context).pushAndRemoveUntil(
        PageRouteBuilder(
          pageBuilder: (context, animation1, animation2) => const SignInPage(),
          transitionDuration: Duration.zero,
          reverseTransitionDuration: Duration.zero,
        ),
        (Route<dynamic> route) =>
            false, // This removes all the routes in the stack
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error logging out: $e')),
      );
    }
  }

  Future<void> _showBottomSheet(BuildContext context) async {
    _speedNotifier.value = 0.0; // Stop the spinning when bottom sheet opens
    
    await showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      builder: (BuildContext context) {
        return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.4,
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildGreetingText(),
                    SizedBox(height: 10),
                    Row(children: [
                      Column(
                        children: [
                          _buildLanguageSelector(setModalState),
                          Text(
                            languageProvider.translate('language'),
                          )
                        ],
                      ),
                      SizedBox(width: 12),
                      Column(
                        children: [
                          _buildHighContrastToggle(setModalState),
                          SizedBox(
                            height: 10,
                          ),
                          Text(
                            languageProvider.translate('contrast'),
                            )
                        ],
                      )
                    ]),
                    Spacer(),
                    _buildLogoutButton(context),
                  ],
                ),
              ),
            );
          },
        );
      },
        );
      },
    );
    _speedNotifier.value = 0.3; // Resume spinning when bottom sheet closes
  }

  Widget _buildHighContrastToggle(StateSetter setModalState) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        final highContrastMode = HighContrastMode.of(context);
        return InkWell(
          onTap: highContrastMode?.toggleHighContrastMode,
          child: Container(
            height: 70,
            width: 70,
            decoration: BoxDecoration(
              color: highContrastMode?.isHighContrast == true
                  ? Colors.black
                  : lightGreen,
              borderRadius: BorderRadius.circular(100),
            ),
            child: SizedBox(
              width: 50,
              height: 50,
              child: Icon(
                Icons.accessibility_new,
                color: highContrastMode?.isHighContrast == true
                    ? Colors.white
                    : Colors.black,
                size: 40,
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildGreetingText() {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 15.0),
              child: Text(
                languageProvider.translate('settings'),
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            if (_profileImageUrl != null)
              Padding(
                padding: const EdgeInsets.only(right: 15.0),
                child: CircleAvatar(
                  radius: 30,
                  backgroundImage: NetworkImage(_profileImageUrl!),
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
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
                  languageProvider.translate('logout'),
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildLanguageSelector(StateSetter bottomSheetSetState) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return GestureDetector(
          child: Container(
            width: 80,
            height: 80,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Image.asset(
                  languageProvider.currentLanguage == 'en'
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
            languageProvider.changeLanguage();
            bottomSheetSetState(() {}); // Force bottom sheet to rebuild
            setState(() {}); // Force CustomAppBar to rebuild
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      forceMaterialTransparency: true,
      leading: Container(),
      actions: [
        InkWell(
          onTap: () {
            _showBottomSheet(context);
          },
          child: Padding(
              padding: EdgeInsets.only(
                top: 5.0,
                left: 0,
                right: 0,
                bottom: 0,
              ),
              child: SpinningLogo(
                initialSpeed: 0.3,
                height: 100,
                width: 120,
                isVary: false,
                speedNotifier: _speedNotifier,
              )),
        )
      ],
    );
  }
}
