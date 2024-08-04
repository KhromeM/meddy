import 'package:flutter/material.dart';
import 'package:meddymobile/utils/animation_speed_controller.dart';
import 'package:rive/rive.dart';

// Example usage

// 1. Decaler notifier in widget that contains the spinning logo
// final ValueNotifier<double> _speedNotifier = ValueNotifier<double>(1.0);

// 2. Inject the notifier into the spinning logo
// SpinningLogo(
//   initialSpeed: 3.0,
//   height: 100,
//   width: 100,
//   isVary: true,
//   speedNotifier: _speedNotifier,
// )

// 3. Programmatically set the speed
// _speedNotifier.value = 0.1;
// _speedNotifier.value = 3.0;
//  e.g.
//  floatingActionButton: FloatingActionButton(
//    onPressed: () {
//      if (!_toggle) {
//        _speedNotifier.value = 0.1;
//        _toggle = !_toggle;
//      } else {
//        _speedNotifier.value = 3.0;
//        _toggle = !_toggle;
//      }
//    },
//    child: Icon(Icons.speed),
//  ),

class SpinningLogo extends StatelessWidget {
  final double initialSpeed;
  final double width;
  final double height;
  final bool isVary;
  final ValueNotifier<double>? speedNotifier;

  const SpinningLogo({
    super.key,
    required this.initialSpeed,
    required this.width,
    required this.height,
    required this.isVary,
    this.speedNotifier,
  });

  @override
  Widget build(BuildContext context) {
    final ValueNotifier<double> effectiveSpeedNotifier =
        speedNotifier ?? ValueNotifier<double>(initialSpeed);
    final controller =
        AnimationSpeedController('Rotate', speedMultiplier: initialSpeed);

    // Listen to changes in the effectiveSpeedNotifier and update the controller
    effectiveSpeedNotifier.addListener(() {
      controller.speedMultiplier = effectiveSpeedNotifier.value;
    });

    return SizedBox(
      width: width,
      height: height,
      child: RiveAnimation.asset(
        !isVary
            ? 'assets/animations/meddy_logo_regular.riv'
            : 'assets/animations/meddy_logo_speedvary.riv',
        controllers: [controller],
      ),
    );
  }
}
