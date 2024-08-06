import 'package:flutter/material.dart';

class BottomBar extends StatelessWidget {
  final int currentIndex;
  final List<BottomNavigationBarItem> bottomNavigationBarItems;
  final PageController pageController;

  const BottomBar({
    super.key,
    required this.currentIndex,
    required this.bottomNavigationBarItems,
    required this.pageController,
  });

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.122,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 3,
              blurRadius: 7,
              offset: Offset(0, 2), // changes position of shadow
            ),
          ],
        ),
        child: BottomNavigationBar(
          unselectedFontSize: 0,
          selectedFontSize: 0,
          iconSize: 30,
          fixedColor: null,
          currentIndex: currentIndex,
          items: bottomNavigationBarItems,
          type: BottomNavigationBarType.fixed,
          onTap: (index) {
            pageController.animateToPage(
              index,
              duration: const Duration(milliseconds: 10),
              curve: Curves.ease,
            );
          },
        ),
      ),
    );
  }
}
