import 'package:flutter/material.dart';

class LoginBackground extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.sizeOf(context).width,
      height: MediaQuery.sizeOf(context).height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: Color.fromRGBO(254, 249, 239, 1),
      ),
      child: Stack(
        children: <Widget>[
          // red top right circle
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
          // bottom right hollow exterior
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
          // bottom left exterior
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
          // bottom right solid interior orange circle
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
          // middle left circle
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
          // bottom left interior
          Positioned(
            top: 778,
            left: -32,
            child: Stack(
              children: [
                Container(
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
              ],
            ),
          ),
          // small hollow circle between the top right and bottom right circles
          Positioned(
            top: 300,
            left: 345,
            child: Container(
              width:
                  100, // 1/3 the diameter of the larger circles (300 / 3 = 100)
              height: 100,
              decoration: BoxDecoration(
                color: Colors.transparent,
                border: Border.all(
                  color: Color.fromRGBO(255, 184, 76, 1),
                  width: 12,
                ),
                borderRadius: BorderRadius.all(Radius.elliptical(100, 100)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
