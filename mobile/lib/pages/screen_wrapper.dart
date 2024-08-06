import 'package:flutter/material.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/pages/health_page.dart';
import 'package:meddymobile/pages/my_home_page.dart';
import 'package:meddymobile/pages/reminder_page.dart';
import 'package:meddymobile/widgets/bottom_bar.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

final _bottomNavigationBarItems = [
  const BottomNavigationBarItem(
    icon: Icon(
      Icons.home,
    ),
    activeIcon: Icon(
      Icons.home,
      color: Color(0xFFD20062),
    ),
    label: '',
    backgroundColor: null,
  ),
  const BottomNavigationBarItem(
    icon: Icon(
      Icons.chat,
    ),
    activeIcon: Icon(
      Icons.chat,
      color: Color(0xFFD895DA),
    ),
    label: '',
  ),
  const BottomNavigationBarItem(
    icon: Icon(
      Icons.monitor_heart,
    ),
    activeIcon: Icon(
      Icons.monitor_heart,
      color: Colors.orange,
    ),
    label: '',
  ),
  const BottomNavigationBarItem(
    icon: Icon(
      Icons.event,
    ),
    activeIcon: Icon(
      Icons.event,
      color: Colors.purple,
    ),
    label: '',
  ),
];

class ScreenWrapper extends StatefulWidget {
  const ScreenWrapper({super.key});

  @override
  State<ScreenWrapper> createState() => _ScreenWrapperState();
}

class _ScreenWrapperState extends State<ScreenWrapper> {
  int _currentIndex = 0;

  final PageController _pageController = PageController(initialPage: 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
          Positioned(
            bottom: 10,
            child: SmoothPageIndicator(
              controller: _pageController,
              count: _bottomNavigationBarItems.length,
              effect: WormEffect(
                dotHeight: 8.0,
                dotWidth: 8.0,
                spacing: 16.0,
                dotColor: Colors.grey,
                activeDotColor: Colors.purple,
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomBar(
        bottomNavigationBarItems: _bottomNavigationBarItems,
        currentIndex: _currentIndex,
        pageController: _pageController,
      ),
    );
  }
}
