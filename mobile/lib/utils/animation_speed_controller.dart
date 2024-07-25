import 'package:rive/rive.dart';

class AnimationSpeedController extends SimpleAnimation {
  double speedMultiplier;

  AnimationSpeedController(
    super.animationName, {
    super.mix,
    this.speedMultiplier = 1,
  });

  @override
  void apply(
      RuntimeArtboard artboard, double elapsedSeconds) {
    if (instance == null || !instance!.keepGoing) {
      isActive = false;
    }
    instance!
      ..animation.apply(instance!.time,
          coreContext: artboard, mix: mix)
      ..advance(elapsedSeconds * speedMultiplier);
  }
}
