import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:meddymobile/providers/chat_provider.dart';
import 'package:meddymobile/pages/chat_page.dart';
import 'package:uuid/uuid.dart';
import 'package:meddymobile/models/message.dart';

class MicPage extends StatefulWidget {
  const MicPage({super.key});

  @override
  State<MicPage> createState() => _MicPageState();
}

class _MicPageState extends State<MicPage> {
  late WSConnection wsConnection;
  late RecorderService recorderService;
  late PlayerService playerService;
  final Uuid _uuid = Uuid();
  bool _isRecording = false;
  bool _isPlaying = false;
  String _reqId = '';
  String _transcribedText = '';
  String _llmResponse = '';
  String _partialTranscript = '';

  @override
  void initState() {
    super.initState();

    // Initialize WebSocket connection and services
    wsConnection = WSConnection();
    recorderService = RecorderService(wsConnection);
    playerService = PlayerService(wsConnection);

    // Connect to WebSocket
    wsConnection.connect();

    // Set up WebSocket handlers
    wsConnection.setHandler("chat_response", _handleChatResponse);
    wsConnection.setHandler("partial_transcript", _handleTranscription);

    // Start recording as soon as the page is opened
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _startRecording();
    });
  }

  @override
  void dispose() {
    // Dispose services
    wsConnection.disconnect();
    playerService.dispose();
    recorderService.dispose();
    super.dispose();
  }

  Future<void> _startRecording() async {
    bool isRecording = await recorderService.toggleRecording();
    if (mounted) {
      setState(() {
        _isRecording = isRecording;
        if (_isRecording) {
          _reqId = _uuid.v4();
          _transcribedText = '';
          _llmResponse = '';
          _partialTranscript = '';
        }
      });
    }
  }

  Future<void> _stopRecording() async {
    if (_isRecording) {
      await recorderService.toggleRecording();
      if (mounted) {
        setState(() {
          _isRecording = false;
        });
      }
    }
  }

  void _playResponse() async {
    if (!_isPlaying) {
      await playerService.playQueuedAudio();
      if (mounted) {
        setState(() {
          _isPlaying = true;
        });
      }
    } else {
      await playerService.stopPlayback();
      if (mounted) {
        setState(() {
          _isPlaying = false;
        });
        await _startRecording();
      }
    }
  }

  void _handleChatResponse(dynamic message) {
    final String reqId = message["reqId"] + "_llm";
    final String text = message['data'];

    if (mounted) {
      setState(() {
        _llmResponse += text;
      });
    }

    if (message['isComplete'] ?? false) {
      final newMessage = Message(
        messageId: reqId,
        userId: "LLM",
        source: "llm",
        text: _llmResponse,
        time: DateTime.now(),
      );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Provider.of<ChatProvider>(context, listen: false)
            .addMessage(newMessage);
      });
    }
  }

  void _handleTranscription(dynamic message) {
    final String text = message['data'];

    if (mounted) {
      setState(() {
        _partialTranscript = text;
      });
    }

    if (message['isComplete'] ?? false) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() {
            _transcribedText = _partialTranscript;
            _partialTranscript = '';
          });
          final newMessage = Message(
            messageId: _reqId + "_user",
            userId: "DEVELOPER",
            source: "user",
            text: _transcribedText,
            time: DateTime.now(),
          );
          Provider.of<ChatProvider>(context, listen: false)
              .addMessage(newMessage);
        }
      });
    }
  }

  String _truncateResponse(String response) {
    // Ensure truncation if response length exceeds a certain length
    if (response.length > 100) {
      return response.substring(0, 100) + '...';
    } else {
      return response;
    }
  }

  @override
  Widget build(BuildContext context) {
    String truncatedResponse = _truncateResponse(_llmResponse);

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Container(
        padding: EdgeInsets.all(20.0),
        height: 400, // Increase the height of the dialog
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Recording",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Align(
              alignment: Alignment.topLeft,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "User: ${_transcribedText + _partialTranscript}",
                    style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "LLM: $truncatedResponse",
                    style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton(
                  onPressed: _isRecording ? _stopRecording : _playResponse,
                  backgroundColor: _isRecording ? Colors.red : Colors.green,
                  child: Icon(
                    _isRecording
                        ? Icons.stop
                        : (_isPlaying ? Icons.stop : Icons.play_arrow),
                    color: Colors.white,
                  ),
                ),
                SizedBox(width: 10),
                FloatingActionButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ChatPage(
                          initialPrompt: _transcribedText,
                        ),
                      ),
                    );
                  },
                  backgroundColor: Colors.black,
                  child: FaIcon(
                    FontAwesomeIcons.penToSquare,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
