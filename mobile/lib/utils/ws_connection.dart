import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'dart:async';
import 'dart:convert';

typedef Handler = void Function(Map<String, dynamic>);

class WSConnection {
  WebSocketChannel? _channel;
  bool _isConnected = false;
  final String _serverUrl = 'ws://localhost:8000/api';
  final Map<String, Handler> _handlers = {};
  Completer<bool>? _authCompleter;

  WSConnection() {
    _handlers['auth'] = _defaultAuthHandler;
  }

  void setHandler(String type, Handler handler) {
    _handlers[type] = handler;
  }

  Future<void> connect() async {
    try {
      _channel = WebSocketChannel.connect(Uri.parse(_serverUrl));
      await _channel?.ready;
      _isConnected = true;
      print('WebSocket connected');

      _channel?.stream.listen(
        _handleIncomingMessage,
        onDone: _handleDisconnect,
        onError: _handleError,
      );
      await authenticate();
      print("Authenticated!");
    } catch (e) {
      print('WebSocket connection failed: $e');
      _isConnected = false;
    }
  }

  void _handleIncomingMessage(dynamic message) {
    try {
      Map<String, dynamic> parsedMessage = json.decode(message);
      print('Received: $parsedMessage');
      String type = parsedMessage['type'] as String? ?? 'UNKNOWN';
      Handler handler = _handlers[type] ?? _handleUnknownMessage;
      handler(parsedMessage);
    } catch (e) {
      print('Error handling message: $e');
    }
  }

  void _handleUnknownMessage(Map<String, dynamic> message) {
    print('Received unknown message type: ${message['type']}');
  }

  void _handleDisconnect() {
    print('WebSocket connection closed');
    _isConnected = false;
  }

  void _handleError(error) {
    print('WebSocket error: $error');
    _isConnected = false;
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

  void _defaultAuthHandler(Map<String, dynamic> _) {
    _authCompleter?.complete(true);
    _authCompleter = null;
  }

  void sendMessage(Object message) {
    if (_isConnected) {
      _channel?.sink.add(json.encode(message));
      print('Sent: $message');
    } else {
      print('WebSocket is not connected');
    }
  }

  void disconnect() {
    if (_isConnected) {
      _channel?.sink.close(status.goingAway);
      _isConnected = false;
      print('WebSocket disconnected');
    }
  }

  bool get isConnected => _isConnected;
}
