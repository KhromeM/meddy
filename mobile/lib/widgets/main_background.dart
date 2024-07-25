import 'package:flutter/material.dart';

class MainBackground extends StatefulWidget {
  @override
  _MainBackgroundState createState() => _MainBackgroundState();
}

class _MainBackgroundState extends State<MainBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat(reverse: true);
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _buildAnimatedCircle({
    required double top,
    required double left,
    required Color color,
    required double baseSize,
  }) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        final size = baseSize + (20 * _animation.value);
        return Positioned(
          top: top,
          left: left,
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: Color.fromRGBO(254, 249, 239, 1),
              border: Border.all(
                color: color,
                width: 20,
              ),
              borderRadius: BorderRadius.circular(size / 2),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: Color.fromRGBO(254, 249, 239, 1),
      ),
      child: Stack(
        children: <Widget>[
          _buildAnimatedCircle(
            top: 660,
            left: 110,
            color: Color.fromRGBO(255, 184, 76, 1),
            baseSize: 280,
          ),
          _buildAnimatedCircle(
            top: -87,
            left: 243,
            color: Color.fromRGBO(66, 133, 244, 1),
            baseSize: 280,
          ),
          _buildAnimatedCircle(
            top: 192,
            left: -157,
            color: Color.fromRGBO(255, 86, 94, 1),
            baseSize: 280,
          ),
          Positioned(
            top: 151,
            left: 265,
            child: Container(
              width: 25,
              height: 25,
              decoration: BoxDecoration(
                color: Color.fromRGBO(255, 255, 255, 1),
              ),
              child: Stack(
                children: [],
              ),
            ),
          ),
          Positioned(
            top: 491,
            left: 31,
            child: Container(
              decoration: BoxDecoration(),
              padding: EdgeInsets.symmetric(horizontal: 0, vertical: 0),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [],
              ),
            ),
          ),
          Positioned(
            top: 79,
            left: 100,
            child: Container(
              width: 132,
              height: 28,
              decoration: BoxDecoration(),
              child: Stack(
                children: [],
              ),
            ),
          ),
          Positioned(
            top: 391,
            left: 191,
            child: Container(
              decoration: BoxDecoration(),
              padding: EdgeInsets.symmetric(horizontal: 0, vertical: 0),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [],
              ),
            ),
          ),
          Positioned(
            top: 0,
            left: 0,
            child: SizedBox.shrink(),
          ),
          Positioned(
            top: 21.78,
            left: 55,
            child: SizedBox(
              width: 302.33,
              height: 12.38,
              child: Stack(
                children: [
                  Positioned(
                    top: 0.56,
                    left: 276,
                    child: SizedBox.shrink(),
                  ),
                  Positioned(
                    top: 0,
                    left: 0,
                    child: SizedBox.shrink(),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
