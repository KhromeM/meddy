import 'package:flutter/material.dart';

class LoginBackground extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 393,
      height: 852,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: Color.fromRGBO(254, 249, 239, 1),
      ),
      child: Stack(
        children: <Widget>[
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
            top: -28,
            left: 262,
            child: Container(
              width: 184,
              height: 189,
              decoration: BoxDecoration(
                color: Color.fromRGBO(255, 86, 94, 0.5),
                borderRadius: BorderRadius.all(Radius.elliptical(184, 189)),
              ),
            ),
          ),
          Positioned(
            top: 651,
            left: 183,
            child: Container(
              width: 225,
              height: 225,
              decoration: BoxDecoration(
                color: Color.fromRGBO(255, 184, 76, 1),
                borderRadius: BorderRadius.all(Radius.elliptical(225, 225)),
              ),
            ),
          ),
          Positioned(
            top: 743,
            left: -64,
            child: Container(
              width: 184,
              height: 189,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(191, 161, 255, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.all(Radius.elliptical(184, 189)),
              ),
            ),
          ),
          Positioned(
            top: 614,
            left: 146,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(255, 184, 76, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.all(Radius.elliptical(300, 300)),
              ),
            ),
          ),
          Positioned(
            top: 151,
            left: -214,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(255, 184, 76, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.all(Radius.elliptical(300, 300)),
              ),
            ),
          ),
          Positioned(
            top: 838,
            left: 130,
            child: Container(
              width: 134,
              height: 5,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(100),
                color: Color.fromRGBO(0, 0, 0, 1),
              ),
            ),
          ),
          // Removed Positioned(top: 0, left: 0, child: null),
          Positioned(
            top: 21.776519775390625,
            left: 55,
            child: Container(
              width: 302.3280334472656,
              height: 12.377750396728516,
              child: Stack(
                children: <Widget>[],
              ),
            ),
          ),
          Positioned(
            top: 778,
            left: -32,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(191, 161, 255, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.all(Radius.elliptical(120, 120)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
