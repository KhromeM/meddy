import 'package:flutter/material.dart';

class LoginBackground extends StatefulWidget {
  @override
  _LoginBackgroundState createState() => _LoginBackgroundState();
}

class _LoginBackgroundState extends State<LoginBackground>
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
          // top right circle
          _buildCircle(
            top: -28,
            left: 262,
            size: 184,
            color: Color(0xFFA489E0),
            isFilled: false,
            isAnimated: true,
          ),
          // bottom right hollow exterior
          _buildCircle(
            top: 614,
            left: 146,
            size: 300,
            color: Color.fromRGBO(255, 184, 76, 1),
          ),
          // bottom right solid interior orange circle
          _buildCircle(
            top: 676,
            left: 208,
            size: 175,
            color: Color.fromRGBO(255, 184, 76, 1),
            isFilled: true,
            isAnimated: true,
          ),
          // bottom left exterior
          _buildCircle(
            top: 743,
            left: -64,
            size: 184,
            color: Color.fromRGBO(191, 161, 255, 1),
          ),
          // middle left circle
          _buildCircle(
            top: 151,
            left: -214,
            size: 250,
            color: Color(0xFFCAEB45),
            isAnimated: true,
          ),
          // bottom left interior
          _buildCircle(
            top: 788,
            left: -22,
            size: 100,
            color: Color.fromRGBO(191, 161, 255, 1),
            isAnimated: true,
          ),
          // small hollow circle between the top right and bottom right circles
          _buildCircle(
            top: 300,
            left: 345,
            size: 100,
            color: Color.fromRGBO(255, 184, 76, 1),
            borderWidth: 12,
            isAnimated: true,
          ),
        ],
      ),
    );
  }
}
