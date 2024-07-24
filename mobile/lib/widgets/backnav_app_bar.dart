// appbar for navigating back to home page

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:meddymobile/pages/my_home_page.dart';

class BacknavAppBar extends StatelessWidget implements PreferredSizeWidget {
  final double appBarHeight = 56.0;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const MyHomePage()),
          );
        },
        child: Padding(
          padding: const EdgeInsets.only(left: 10),
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(
                Icons.circle,
                size: 60,
                color: Color.fromARGB(255, 255, 181, 93),
                // Color.fromARGB(255, 202, 235, 69) theme green
                //Color.fromARGB(255, 255, 181, 93) theme orange
              ),
              Padding(
                padding: const EdgeInsets.only(left: 14, top: 3),
                child: FaIcon(
                  FontAwesomeIcons.arrowLeft,
                  size: 20,
                  color: Colors.white,
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(appBarHeight);
}
