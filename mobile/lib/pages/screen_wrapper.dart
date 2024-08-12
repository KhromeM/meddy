import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/pages/health_page.dart';
import 'package:meddymobile/pages/my_home_page.dart';
import 'package:meddymobile/pages/reminder_page.dart';
import 'package:meddymobile/widgets/bottom_bar.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';

class ScreenWrapper extends StatefulWidget {
  const ScreenWrapper({super.key});

  @override
  State<ScreenWrapper> createState() => _ScreenWrapperState();
}

class _ScreenWrapperState extends State<ScreenWrapper> {
  int _currentIndex = 0;
  final PageController _pageController = PageController(initialPage: 0);

  List<BottomNavigationBarItem> get _bottomNavigationBarItems {
    return [
      _buildNavigationItem('assets/icons/Home_light.svg', 0),
      _buildNavigationItem('assets/icons/comment_light.svg', 1),
      _buildNavigationItem('assets/icons/stethoscope_light.svg', 2),
      _buildNavigationItem('assets/icons/Date_range_light.svg', 3),
    ];
  }

  BottomNavigationBarItem _buildNavigationItem(String assetName, int index) {
    Color color = _currentIndex == index ? Color(0xFF0E3C26) : Colors.grey;
    return BottomNavigationBarItem(
      icon: SvgPicture.asset(
        assetName,
        height: 40,
        width: 40,
        colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
      ),
      activeIcon: SvgPicture.asset(
        assetName,
        height: 40,
        width: 40,
        colorFilter: ColorFilter.mode(Color(0xFF0E3C26), BlendMode.srcIn),
      ),
      label: '',
    );
  }

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
      child: Scaffold(
        extendBodyBehindAppBar: true,
        body: Stack(
          alignment: Alignment.topCenter,
          children: [
            PageView(
              controller: _pageController,
              onPageChanged: (newIndex) {
                setState(() {
                  _currentIndex = newIndex;
                });
              },
              children: [
                const MyHomePage(),
                ChatPage(),
                HealthPage(),
                ReminderPage(),
              ],
            ),
          ],
        ),
        bottomNavigationBar: _currentIndex == 1
            ? null
            : BottomBar(
                bottomNavigationBarItems: _bottomNavigationBarItems,
                currentIndex: _currentIndex,
                pageController: _pageController,
              ),
      ),
    );
  }
}
