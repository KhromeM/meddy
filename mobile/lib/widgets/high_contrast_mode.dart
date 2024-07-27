import 'package:flutter/material.dart';

class HighContrastMode extends InheritedWidget {
  final bool isHighContrast;
  final VoidCallback toggleHighContrastMode;

  const HighContrastMode({
    super.key,
    required this.isHighContrast,
    required this.toggleHighContrastMode,
    required super.child,
  });

  static HighContrastMode? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<
        HighContrastMode>();
  }

  @override
  bool updateShouldNotify(HighContrastMode oldWidget) {
    return isHighContrast != oldWidget.isHighContrast;
  }
}
