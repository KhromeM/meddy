import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/my_app_state.dart';

class ChatPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: appState.chats.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(appState.chats[index]),
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Type your message',
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: (text) {
                        // Placeholder for adding chat
                      },
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.send),
                    onPressed: () {
                      // Placeholder for send functionality
                    },
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
