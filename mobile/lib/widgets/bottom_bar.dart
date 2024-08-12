import 'package:flutter/material.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';

class BottomBar extends StatefulWidget {
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
  _BottomBarState createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> with TickerProviderStateMixin {
  late List<AnimationController> _animationControllers;
  late List<Animation<double>> _sizeAnimations;
  late List<Animation<double>> _opacityAnimations;

  @override
  void initState() {
    super.initState();
    _initAnimations();
  }

  void _initAnimations() {
    _animationControllers = List.generate(
      widget.bottomNavigationBarItems.length,
      (index) => AnimationController(
        duration: const Duration(milliseconds: 400),
        vsync: this,
      ),
    );
    _sizeAnimations = _animationControllers
        .map((controller) => CurvedAnimation(
              parent: controller,
              curve: Curves.easeOut,
            ))
        .toList();
    _opacityAnimations = _animationControllers
        .map((controller) => Tween<double>(begin: 1.0, end: 0.0).animate(
              CurvedAnimation(
                parent: controller,
                curve: Interval(0.5, 1.0, curve: Curves.easeOut),
              ),
            ))
        .toList();
  }

  @override
  void dispose() {
    for (var controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double bottomPadding = MediaQuery.of(context).padding.bottom;
    final double barHeight = MediaQuery.of(context).size.height * 0.10;
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    return Container(
      height: barHeight,
      decoration: BoxDecoration(
        color: isHighContrast
            ? Colors.white
            : Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 3,
            blurRadius: 7,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            left: 0,
            right: 0,
            top: 0,
            bottom: bottomPadding,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(
                widget.bottomNavigationBarItems.length,
                (index) => GestureDetector(
                  onTap: () {
                    _animationControllers[index].forward(from: 0.0);
                    widget.pageController.animateToPage(
                      index,
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  },
                  child: Container(
                    color: Colors.transparent,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        AnimatedBuilder(
                          animation: _animationControllers[index],
                          builder: (context, child) {
                            return Opacity(
                              opacity: _opacityAnimations[index].value,
                              child: Container(
                                width: 60 * _sizeAnimations[index].value,
                                height: 60 * _sizeAnimations[index].value,
                                decoration: BoxDecoration(
                                  color: isHighContrast
                                      ? Colors.black
                                      : Color(0xFF0E3C26).withOpacity(0.3),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            );
                          },
                        ),
                        Padding(
                          padding:
                              EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                          child: widget.currentIndex == index
                              ? widget
                                  .bottomNavigationBarItems[index].activeIcon
                              : widget.bottomNavigationBarItems[index].icon,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
