// appbar for main page
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:meddymobile/pages/profile_page.dart';
import 'package:meddymobile/utils/app_colors.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final double appBarHeight = 56.0;

  Future _showBottomSheet(BuildContext context){
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white, 
      builder: (context)=> SizedBox(
        //heightFactor: 0.8,
        width: MediaQuery.of(context).size.width,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildButton(
              'Reminders',
              () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProfilePage()),
                );
              },
            ),
            SizedBox(height: 20),
              _buildButton(
              'Your Health',
              () {
                //TODO: nav to health page
              },
            )
          // You can add more widgets here if needed
        ],
      ),
      ),
    ));
  }

Widget _buildButton(String text, VoidCallback onPressed) {
  return SizedBox(
    width: double.infinity, 
    child: ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: lightPurple,
        foregroundColor: Colors.black,
        padding: EdgeInsets.symmetric(vertical: 20),
        alignment: Alignment.centerLeft, 
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        elevation: 0, 
      ),
      child: Padding(
        padding: EdgeInsets.only(left: 16),
        child: Text(
          text,
          style: TextStyle(fontSize: 24,
          fontWeight: FontWeight.w600),
      ),
      ),
    ),
  );
}
  
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: InkWell(
        onTap: () {
          _showBottomSheet(context);
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
