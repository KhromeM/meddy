import 'package:flutter/material.dart';

class MainBackground extends StatelessWidget {
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
              child: Stack(
                children: [
                  // Add child widgets here
                ],
              ),
            ),
          ),
          Positioned(
            top: 660,
            left: 110,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(255, 184, 76, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.circular(300),
              ),
            ),
          ),
          Positioned(
            top: -87,
            left: 243,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(66, 133, 244, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.circular(300),
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
            top: 192,
            left: -157,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: Color.fromRGBO(254, 249, 239, 1),
                border: Border.all(
                  color: Color.fromRGBO(255, 86, 94, 1),
                  width: 20,
                ),
                borderRadius: BorderRadius.circular(300),
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
