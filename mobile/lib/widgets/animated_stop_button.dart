import 'package:flutter/material.dart';

class AnimatedStopButton extends StatefulWidget {
  final VoidCallback onPressed;
  const AnimatedStopButton({super.key, required this.onPressed});

  @override
  _AnimatedStopButtonState createState() => _AnimatedStopButtonState();
}

class _AnimatedStopButtonState extends State<AnimatedStopButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Animation<double>> _dotAnimations = [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    for (int i = 0; i < 3; i++) {
      _dotAnimations.add(
        Tween<double>(begin: 0.0, end: -5.0).animate(
          CurvedAnimation(
            parent: _controller,
            curve: Interval(i * 0.2, (i + 1) * 0.2, curve: Curves.easeInOut),
          ),
        ),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildDots(),
          SizedBox(width: 8),
          _buildButton(),
        ],
      ),
    );
  }

  Widget _buildDots() {
    return Row(
      children: List.generate(3, (index) {
        return AnimatedBuilder(
          animation: _dotAnimations[index],
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, _dotAnimations[index].value),
              child: Container(
                width: 6,
                height: 6,
                margin: EdgeInsets.symmetric(horizontal: 2),
                decoration: BoxDecoration(
                  color: Colors.grey[600],
                  shape: BoxShape.circle,
                ),
              ),
            );
          },
        );
      }),
    );
  }

  Widget _buildButton() {
    return ElevatedButton(
      onPressed: widget.onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.orange,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.black,
            ),
            child: Icon(Icons.stop, size: 16, color: Colors.orange),
          ),
          SizedBox(width: 8),
          Text(
            'Stop generating',
            style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
