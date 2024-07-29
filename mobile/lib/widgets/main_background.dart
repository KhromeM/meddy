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
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _buildCircle({
    required double top,
    required double left,
    required double size,
    required Color color,
    bool isFilled = false,
    double borderWidth = 20,
    bool isAnimated = false,
  }) {
    Widget circle = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: isFilled ? color : Color.fromRGBO(254, 249, 239, 1),
        border: Border.all(
          color: color,
          width: borderWidth,
        ),
        borderRadius: BorderRadius.all(Radius.elliptical(size, size)),
      ),
    );

    if (isAnimated) {
      return AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          final animatedSize =
              size + (size * 0.25 * _animation.value); // 25% size variation
          return Positioned(
            top: top + (size - animatedSize) / 2,
            left: left + (size - animatedSize) / 2,
            child: Container(
              width: animatedSize,
              height: animatedSize,
              decoration: BoxDecoration(
                color: isFilled ? color : Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: color,
                  width: borderWidth,
                ),
                borderRadius: BorderRadius.all(
                    Radius.elliptical(animatedSize, animatedSize)),
              ),
            ),
          );
        },
      );
    } else {
      return Positioned(
        top: top,
        left: left,
        child: circle,
      );
    }
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
          // bottom right circle
          _buildCircle(
            top: 660,
            left: 110,
            size: 280,
            color: Color.fromRGBO(255, 184, 76, 1),
            isAnimated: true,
          ),
          // top right circle
          _buildCircle(
            top: -87,
            left: 243,
            size: 280,
            color: Color(0xFFA489E0),
            isAnimated: true,
          ),
          // middle left circle
          _buildCircle(
            top: 192,
            left: -157,
            size: 280,
            color: Color(0xFFCAEB45),
            isAnimated: true,
          ),
          // Merging the conflicting section
          Positioned(
            top: 151,
            left: 265,
            child: Container(
              width: 25,
              height: 25,
              decoration: BoxDecoration(
                color: Color.fromRGBO(255, 255, 255, 1),
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
