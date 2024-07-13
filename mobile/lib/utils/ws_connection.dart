import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'dart:async';
import 'dart:convert';

class WSConnection {
  WebSocketChannel? _channel;
  bool _isConnected = false;
  final String _serverUrl = 'ws://localhost:8000/api';

  Completer<bool>? _authCompleter;

  Future<void> connect() async {
    try {
      _channel = WebSocketChannel.connect(Uri.parse(_serverUrl));
      await _channel!.ready;
      _isConnected = true;
      print('WebSocket connected');

      _channel!.stream.listen(
        (message) {
          print('Received: $message');
          _handleMessage(message);
        },
        onDone: () {
          print('WebSocket connection closed');
          _isConnected = false;
        },
        onError: (error) {
          print('WebSocket error: $error');
          _isConnected = false;
        },
      );
      await authenticate();
      print("Authenticated!");
    } catch (e) {
      print('WebSocket connection failed: $e');
      _isConnected = false;
    }
  }

  Future<bool> authenticate() async {
    if (!_isConnected) {
      throw Exception('WebSocket is not connected');
    }

    _authCompleter = Completer<bool>();

    sendMessage({
      'type': 'auth',
      'data': {'idToken': 'dev'}
    });

    return _authCompleter!.future;
  }

  void _handleMessage(dynamic message) {
    Map<String, dynamic> parsedMessage = json.decode(message);

    if (parsedMessage['type'] == 'auth') {
      _authCompleter?.complete(true);
      _authCompleter = null;
    }
  }

  void sendMessage(Object message) {
    if (_isConnected) {
      _channel!.sink.add(json.encode(message));
      print('Sent: $message');
    } else {
      print('WebSocket is not connected');
    }
  }

  void disconnect() {
    if (_isConnected) {
      _channel!.sink.close(status.goingAway);
      _isConnected = false;
      print('WebSocket disconnected');
    }
  }

  bool get isConnected => _isConnected;
}
