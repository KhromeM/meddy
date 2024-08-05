import 'package:flutter/material.dart';
import 'package:jumping_dot/jumping_dot.dart';

class AnimatedStopButton extends StatelessWidget {
  final VoidCallback onPressed;
  final bool isAudio;

  const AnimatedStopButton({
    Key? key,
    required this.onPressed,
    this.isAudio = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          JumpingDots(
            color: Colors.black,
            radius: 8,
            numberOfDots: 3,
          ),
          SizedBox(width: 8),
          _buildButton(),
        ],
      ),
    );
  }

  Widget _buildButton() {
    return ElevatedButton(
      onPressed: onPressed,
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
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.black,
            ),
            child: Icon(Icons.stop, size: 15, color: Colors.orange),
          ),
          SizedBox(width: 8),
          Text(
            isAudio ? 'Stop speaking' : 'Stop generating',
            style: TextStyle(
                color: Colors.black, fontWeight: FontWeight.w700, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
