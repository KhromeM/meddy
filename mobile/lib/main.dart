import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ChatScreen(),
    );
  }
}

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _textController = TextEditingController();
  String _llmResponse = "";

  void _sendMessage() {
    // Replace this with your logic to handle user message and get LLM response
    setState(() {
      _llmResponse = "This is a placeholder LLM response";
    });
    _textController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chatbot'),
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: () => {}, // Handle menu button press
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.account_circle),
            onPressed: () => {}, // Handle user icon press
          ),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0.0, // Remove app bar shadow
      ),
      body: Container(
        padding: EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor.withOpacity(0.05),
          borderRadius: BorderRadius.circular(20.0),
        ),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                reverse: true,
                itemCount: 1 + (_llmResponse.isNotEmpty ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == 0 && _llmResponse.isNotEmpty) {
                    return _buildLLMResponse(context);
                  } else {
                    return _buildUserMessage(context);
                  }
                },
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: InputDecoration(
                      hintText: 'Type your message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20.0),
                        borderSide: BorderSide(
                          color: Theme.of(context).primaryColor,
                        ),
                      ),
                      contentPadding: EdgeInsets.all(12.0),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLLMResponse(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.0),
      child: Text(
        _llmResponse,
        style: TextStyle(fontSize: 16.0),
      ),
      decoration: BoxDecoration(
        color: Colors.blueGrey[100],
        borderRadius: BorderRadius.circular(8.0),
      ),
    );
  }

  Widget _buildUserMessage(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.0),
      child: Text(
        'Your message here...',
        style: TextStyle(fontSize: 16.0),
      ),
      alignment: Alignment.centerRight,
      decoration: BoxDecoration(
        color: Colors.green[100],
        borderRadius: BorderRadius.circular(8.0),
      ),
    );
  }
}
