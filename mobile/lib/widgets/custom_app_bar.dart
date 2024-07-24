// appbar for main page

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/pages/profile_page.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final double appBarHeight = 56.0;

  Future _showBottomSheet(BuildContext context){
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white, 
      builder: (context)=> SizedBox(
        width: MediaQuery.of(context).size.width,
        height: 500,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ElevatedButton(
                onPressed: () { 
                  Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProfilePage()),
              );
            },
            child: Text('Reminders'),
          ),
              ElevatedButton(
              onPressed: () {
                //TODO: make health/research page
              },
            child: Text('Your health'),
          ),
          // You can add more widgets here if needed
        ],
      ),
      ),
    ));
  }


  
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: InkWell(
        onTap: () {
          _showBottomSheet(context);
          // Navigator.push(
          //   context,
          //   MaterialPageRoute(builder: (context) => const ProfilePage()),
          // );
        },
        child: Padding(
          padding: const EdgeInsets.only(left: 10),
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(
                Icons.circle,
                size: 60,
                color: Colors.brown,
              ),
              Padding(
                padding: const EdgeInsets.only(left: 14, top: 3),
                child: FaIcon(
                  FontAwesomeIcons.splotch,
                  size: 20,
                  color: Colors.white,
                ),
                
              )
            ],
          ),
        ),
      ),
      actions: [
        InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ChatPage()),
            );
          },
          child: Padding(
            padding: const EdgeInsets.only(right: 10),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(
                  Icons.circle,
                  size: 60,
                  color: Colors.black,
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: FaIcon(
                    FontAwesomeIcons.penToSquare,
                    size: 20,
                    color: Colors.white,
                  ),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(appBarHeight);
}
