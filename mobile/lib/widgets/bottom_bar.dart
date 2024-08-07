import 'package:flutter/material.dart';

class BottomBar extends StatelessWidget {
  final int currentIndex;
  final List<BottomNavigationBarItem> bottomNavigationBarItems;
  final PageController pageController;

  const BottomBar({
    Key? key,
    required this.currentIndex,
    required this.bottomNavigationBarItems,
    required this.pageController,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context),
      child: Container(
        height: MediaQuery.of(context).size.height * .11,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 3,
              blurRadius: 7,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          items: bottomNavigationBarItems
              .map((item) => BottomNavigationBarItem(
                    icon: Padding(
                      padding: EdgeInsets.only(top: 0, bottom: 0),
                      child: item.icon,
                    ),
                    label: '',
                  ))
              .toList(),
          type: BottomNavigationBarType.fixed,
          onTap: (index) {
            pageController.animateToPage(
              index,
              duration: const Duration(milliseconds: 10),
              curve: Curves.ease,
            );
          },
          selectedItemColor: Theme.of(context).primaryColor,
          unselectedItemColor: Colors.grey,
          showSelectedLabels: false,
          showUnselectedLabels: false,
          iconSize: 30,
        ),
      ),
    );
  }
}
