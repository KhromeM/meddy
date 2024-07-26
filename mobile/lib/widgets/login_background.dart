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
    required double baseSize,
    required Color color,
    bool isFilled = false,
    double borderWidth = 20,
  }) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        final size = baseSize + (10 * _animation.value);
        return Positioned(
          top: top,
          left: left,
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: isFilled ? color : Color.fromRGBO(254, 249, 239, 1),
              border: isFilled
                  ? null
                  : Border.all(
                      color: color,
                      width: borderWidth,
                    ),
              borderRadius: BorderRadius.all(Radius.elliptical(size, size)),
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
          // red top right circle
          _buildAnimatedCircle(
            top: -28,
            left: 262,
            baseSize: 184,
            color: Color.fromRGBO(255, 86, 94, 0.5),
            isFilled: true,
          ),
          // bottom right hollow exterior
          _buildAnimatedCircle(
            top: 614,
            left: 146,
            baseSize: 300,
            color: Color.fromRGBO(255, 184, 76, 1),
          ),
          // bottom left exterior
          _buildAnimatedCircle(
            top: 743,
            left: -64,
            baseSize: 184,
            color: Color.fromRGBO(191, 161, 255, 1),
          ),
          // bottom right solid interior orange circle
          _buildAnimatedCircle(
            top: 651,
            left: 183,
            baseSize: 225,
            color: Color.fromRGBO(255, 184, 76, 1),
            isFilled: true,
          ),
          // middle left circle
          _buildAnimatedCircle(
            top: 151,
            left: -214,
            baseSize: 300,
            color: Color.fromRGBO(255, 184, 76, 1),
          ),
          // bottom left interior
          _buildAnimatedCircle(
            top: 778,
            left: -32,
            baseSize: 120,
            color: Color.fromRGBO(191, 161, 255, 1),
          ),
          // small hollow circle between the top right and bottom right circles
          _buildAnimatedCircle(
            top: 300,
            left: 345,
            baseSize: 100,
            color: Color.fromRGBO(255, 184, 76, 1),
            borderWidth: 12,
          ),
        ],
      ),
    );
  }
}
