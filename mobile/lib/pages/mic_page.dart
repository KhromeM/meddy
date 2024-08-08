import 'package:blur/blur.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:meddymobile/providers/chat_provider.dart';
import 'package:uuid/uuid.dart';
import 'package:meddymobile/models/message.dart';
import 'package:siri_wave/siri_wave.dart';
import 'package:aura_box/aura_box.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:path/path.dart' as path;
import 'package:image/image.dart' as img;
import 'package:meddymobile/services/chat_service.dart';

class MicPage extends StatefulWidget {
  final String userName;

  const MicPage({super.key, required this.userName});

  @override
  State<MicPage> createState() => _MicPageState();
}

class _MicPageState extends State<MicPage> {
  late WSConnection wsConnection;
  late RecorderService recorderService;
  late PlayerService playerService;
  final Uuid _uuid = Uuid();
  bool _isRecording = false;
  String _reqId = '';
  String _transcribedText = '';
  String _llmResponse = '';
  late IOS7SiriWaveformController siriController;
  bool _isMeddySpeaking = false;

  final ImagePicker _picker = ImagePicker();
  String? _previewImagePath;
  bool _isSendingImage = false;

  final ChatService _chatService = ChatService();

  @override
  void initState() {
    super.initState();

    // ws connect
    wsConnection = WSConnection();
    recorderService = RecorderService(wsConnection);
    playerService = PlayerService(wsConnection);

    // siri wave constructor
    siriController = IOS7SiriWaveformController(
      amplitude: 0.1,
      color: Colors.white,
      frequency: 6,
      speed: 0.1,
    );

    // handlers
    wsConnection.setHandler("chat_response", _handleChatResponse);
    wsConnection.setHandler("partial_transcript", _handleTranscription);

    // Start recording as soon as the page is opened
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _startRecording();
    });

    // Set status bar and navigation bar to black
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.black,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.black,
      systemNavigationBarIconBrightness: Brightness.light,
      systemNavigationBarDividerColor: Colors.black,
    ));
  }

  @override
  void dispose() {
    // Dispose services
    recorderService.dispose();
    playerService.dispose();
    super.dispose();
  }

  Future<void> _startRecording() async {
    // Stop any audio playback when starting recording
    await playerService.stopPlayback();

    // Clear the selected image when starting recording
    setState(() {
      _previewImagePath = null;
    });

    bool isRecording = await recorderService.toggleRecording();
    if (mounted) {
      setState(() {
        _isRecording = isRecording;
        _isMeddySpeaking = false;
        siriController.amplitude = _isRecording ? 0.8 : 0.1;
        siriController.color = _isRecording ? Colors.white : Colors.blue;
        if (_isRecording) {
          _reqId = _uuid.v4();
          _transcribedText = '';
          _llmResponse = '';
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
          siriController.amplitude = 0.1;
          siriController.color = Colors.white;
        });
        playerService
            .playQueuedAudio(); // Play the queued audio after stopping recording
      }
    }
  }

  Future<File> _resizeImage(String imagePath) async {
    final image = File(imagePath);
    final bytes = await image.readAsBytes();
    img.Image? originalImage = img.decodeImage(bytes);
    if (originalImage == null) return image;

    img.Image resizedImage = img.copyResize(originalImage, width: 800);
    final resizedBytes = img.encodeJpg(resizedImage);
    final resizedFile = File('${image.path}_resized.jpg')
      ..writeAsBytesSync(resizedBytes);

    return resizedFile;
  }

  Future<void> _selectImageFromCamera() async {
    final image = await _picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      final resizedImage = await _resizeImage(image.path);
      setState(() {
        _previewImagePath = resizedImage.path;
      });
    }
  }

  void _handleChatResponse(dynamic message) {
    final String reqId = message["reqId"] + "_llm";
    final String text = message['data'];

    if (mounted) {
      setState(() {
        _llmResponse += text;
        _isMeddySpeaking = true;
        siriController.amplitude = 0.8;
        siriController.color = Colors.blue;
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
      if (mounted) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            Provider.of<ChatProvider>(context, listen: false)
                .addMessage(newMessage);
            playerService.playQueuedAudio(); // Play Meddy's response
            setState(() {
              _isMeddySpeaking = false;
              siriController.amplitude = 0.1;
              siriController.color = Colors.white;
            });
          }
        });
      }
    }
  }

  void _handleTranscription(dynamic message) {
    final String text = message['data'];
    final bool isComplete = message['isComplete'] ?? false;

    if (!isComplete) {
      if (mounted) {
        setState(() {
          _transcribedText += text;
        });
      }
    } else {
      if (mounted) {
        setState(() {
          _transcribedText = text;
        });
      }

      // Check if the transcribed text is empty and set a default message if it is
      if (_transcribedText.trim().isEmpty) {
        _transcribedText = '';
      }

      /* final newMessage = Message(
        messageId: _reqId + "_user",
        userId: "DEVELOPER",
        source: "user",
        text: _transcribedText,
        time: DateTime.now(),
      );
      if (mounted) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            Provider.of<ChatProvider>(context, listen: false)
                .addMessage(newMessage);
          }
        });
      } */
    }
  }

  String _truncateMeddyResponse(String text) {
    if (text.length <= 100) return text;
    return '${text.substring(0, 100)} . . .';
  }

  String _truncateUserChat(String text) {
    if (text.length <= 100) return text;

    // Show only the last 97 characters (accounting for " . . . " being 3 characters)
    String lastPart = text.substring(text.length - 97);

    return ' . . . $lastPart';
  }

  @override
  Widget build(BuildContext context) {
    String truncatedResponse = _truncateMeddyResponse(_llmResponse);
    String truncatedTranscription = _truncateUserChat(_transcribedText);

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                SizedBox(height: 30),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 40, 20, 20),
                  child: Align(
                    alignment: Alignment.topCenter,
                    child: AuraBox(
                      spots: [
                        AuraSpot(
                          color: Colors.purple.withOpacity(0.5),
                          radius: 80.0,
                          alignment: Alignment.topRight,
                          blurRadius: 50.0,
                          stops: const [0.0, 0.5],
                        ),
                        AuraSpot(
                          color: Colors.blueAccent.withOpacity(0.5),
                          radius: 80.0,
                          alignment: Alignment.bottomLeft,
                          blurRadius: 50.0,
                          stops: const [0.0, 0.5],
                        ),
                      ],
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: Container(
                        padding: EdgeInsets.all(10.0),
                        child: Text(
                          "Meddy: $truncatedResponse",
                          style: TextStyle(fontSize: 18, color: Colors.white),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Center(
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Blur(
                          blur: 10,
                          blurColor: Colors.black,
                          borderRadius: BorderRadius.circular(150),
                          child: Container(
                            width: 300,
                            height: 300,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.black.withOpacity(0.1),
                            ),
                          ),
                        ),
                        Container(
                          width: 300,
                          height: 300,
                          child: SiriWaveform.ios7(
                            controller: siriController,
                            options: IOS7SiriWaveformOptions(
                              height: 300,
                              width: 300,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Align(
                    alignment: Alignment.center,
                    child: AuraBox(
                      spots: [
                        AuraSpot(
                          color: Colors.blueAccent.withOpacity(0.5),
                          radius: 80.0,
                          alignment: Alignment.topRight,
                          blurRadius: 50.0,
                          stops: const [0.0, 0.5],
                        ),
                        AuraSpot(
                          color: Colors.purple.withOpacity(0.5),
                          radius: 80.0,
                          alignment: Alignment.bottomLeft,
                          blurRadius: 50.0,
                          stops: const [0.0, 0.5],
                        ),
                      ],
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: Container(
                        padding: EdgeInsets.all(10.0),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                "${widget.userName}: $truncatedTranscription",
                                style: TextStyle(
                                    fontSize: 18, color: Colors.white),
                                textAlign: TextAlign.center,
                              ),
                            ),
                            if (_previewImagePath != null)
                              Container(
                                margin: EdgeInsets.only(left: 10),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(16.0),
                                  child: Image.file(
                                    File(_previewImagePath!),
                                    width: 100,
                                    height: 130,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(
                    height:
                        75), // Additional space below the user message container
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      FloatingActionButton(
                        heroTag: "mic_button",
                        onPressed:
                            _isRecording ? _stopRecording : _startRecording,
                        backgroundColor: Colors.white,
                        shape: CircleBorder(),
                        child: Icon(
                          _isRecording ? Icons.pause : Icons.mic,
                          color: Colors.black,
                        ),
                      ),
                      SizedBox(width: 10),
                      FloatingActionButton(
                        heroTag: "camera_button",
                        onPressed: _selectImageFromCamera,
                        backgroundColor: Colors.white,
                        shape: CircleBorder(),
                        child: Icon(
                          Icons.camera_alt,
                          color: Colors.black,
                        ),
                      ),
                      Spacer(),
                      FloatingActionButton(
                        heroTag: "close_button",
                        onPressed: () {
                          playerService
                              .stopPlayback(); // Stop audio playback when exiting the page
                          Navigator.pop(context);
                        },
                        backgroundColor: Colors.red,
                        shape: CircleBorder(),
                        child: Icon(
                          Icons.close,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 40), // Extra padding at the bottom
              ],
            ),
          ],
        ),
      ),
    );
  }
}
