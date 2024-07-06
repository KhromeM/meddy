import 'package:flutter/material.dart';

class ChatPage extends StatefulWidget {
  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  TextEditingController _textEditingController = TextEditingController();
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    _textEditingController.addListener(() {
      setState(() {
        _isTyping = _textEditingController.text.isNotEmpty;
      });
    });
  }

  void _sendMessage() {
    if (_textEditingController.text.isNotEmpty) {
      // Logic to send message to LLM (Left as placeholder)
      print('Sending message: ${_textEditingController.text}');
      // Clear text field after sending message
      _textEditingController.clear();
      // Assuming receiving a response from LLM after sending
      // You can implement response handling here
    }
  }

  void _startListening() {
    // Logic to start listening to user's voice input (Left as placeholder)
    print('Start listening...');
    // Example of functionality: Implement speech-to-text or voice recognition
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Chat with LLM'),
      // ),
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: Text('Chat with LLM here...'),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: Colors.grey[200],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textEditingController,
                      decoration: InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 16),
                        hintText: 'Type your message...',
                        border: InputBorder.none,
                      ),
                      keyboardType: TextInputType.text,
                    ),
                  ),
                  InkWell(
                    onTap: _isTyping ? _sendMessage : _startListening,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Icon(
                        _isTyping
                            ? Icons.arrow_forward_ios_rounded
                            : Icons.mic_rounded,
                        color: Theme.of(context).primaryColor,
                      ),
                    ),
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
