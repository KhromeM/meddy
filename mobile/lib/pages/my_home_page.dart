import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:meddymobile/providers/chat_provider.dart';
import 'package:meddymobile/utils/app_colors.dart';
import 'package:meddymobile/widgets/boxes.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/widgets/mic_page.dart';
import 'package:meddymobile/widgets/custom_app_bar.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:meddymobile/services/recorder_service.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final List<String> texts = [
    'box1',
    'box2',
    'box3',
    'box4',
    "box5",
    'box6',
    'box7',
    'box8',
  ];

  late WSConnection wsConnection;
  late PlayerService playerService;
  late RecorderService recorderService;

  @override
  void initState() {
    super.initState();

    // Initialize WebSocket connection and services
    wsConnection = WSConnection();
    playerService = PlayerService(wsConnection);
    recorderService = RecorderService(wsConnection);

    // Connect to WebSocket
    wsConnection.connect();

    // Load chat history on init
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (Provider.of<ChatProvider>(context, listen: false).messages.isEmpty) {
        print('Loading chat history in MyHomePage...');
        Provider.of<ChatProvider>(context, listen: false).loadChatHistory();
      }
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

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);

    return Stack(
      children: [
        MainBackground(),
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: CustomAppBar(),
          body: Column(
            children: [
              SizedBox(height: 20),
              InkWell(
                onTap: () {
                  _showMic();
                },
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 100.0,
                      height: 100.0,
                      decoration: BoxDecoration(
                        color: orangeAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    Icon(
                      Icons.mic,
                      size: 50,
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20),
              Boxes(
                texts: texts,
                isHighContrast: highContrastMode?.isHighContrast ?? false,
              ),
              SizedBox(height: 100),
            ],
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: highContrastMode?.toggleHighContrastMode,
            child: Icon(
              highContrastMode?.isHighContrast == true
                  ? Icons.brightness_7
                  : Icons.brightness_3,
            ),
          ),
        ),
      ],
    );
  }

  void _showMic() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return MicPage();
      },
    );
  }
}
