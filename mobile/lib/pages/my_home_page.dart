import 'package:flutter/material.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:meddymobile/providers/chat_provider.dart';
import 'package:meddymobile/widgets/boxes.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import 'package:meddymobile/widgets/main_background.dart';
import 'package:meddymobile/pages/mic_page.dart';
import 'package:meddymobile/widgets/custom_app_bar.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:meddymobile/services/player_service.dart';
import 'package:meddymobile/services/recorder_service.dart';
import 'package:aura_box/aura_box.dart'; // Add this import
import 'package:meddymobile/utils/languages.dart';
import 'package:flutter/services.dart';

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

  final AuthService _authService = AuthService();
  late String _firstName;

  @override
  void initState() {
    super.initState();

    // Initialize WebSocket connection and services
    wsConnection = WSConnection();
    playerService = PlayerService(wsConnection);
    recorderService = RecorderService(wsConnection);

    _firstName = _authService.getFirstName() ?? 'User';

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
    playerService.dispose();
    recorderService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Stack(
          children: [
            // MainBackground(),
            Scaffold(
              extendBodyBehindAppBar: true,
              backgroundColor: Colors.transparent,
              appBar: CustomAppBar(),
              body: Column(
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.07),
                  Padding(
                    padding: const EdgeInsets.only(left: 20),
                    child: Row(
                      children: [
                        Text(
                          languageProvider.translate('hello'),
                          style:
                              TextStyle(fontSize: 40, color: Color(0xFF0E3C26)),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 20.0),
                    child: Row(
                      children: [
                        Text(
                          _firstName,
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 35,
                              color: Color(0xFF0E3C26)),
                        )
                      ],
                    ),
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.02),
                  InkWell(
                    onTap: () {
                      _showMic();
                    },
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          width: MediaQuery.of(context).size.width * 0.95,
                          height: 100,
                          decoration: BoxDecoration(
                            color: Color.fromRGBO(1, 99, 218, 1),
                            shape: BoxShape.rectangle,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.3),
                                spreadRadius: 1,
                                blurRadius: 5,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            SizedBox(
                              width: 10,
                            ),
                            Column(
                              children: [
                                Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    Icon(
                                      Icons.circle,
                                      size: 75,
                                      color: Colors.white,
                                    ),
                                    Icon(Icons.phone_in_talk,
                                        color: Color.fromRGBO(1, 99, 218, 1),
                                        size: 30),
                                  ],
                                )
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  languageProvider.translate('start_voice'),
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w700),
                                ),
                                Text(
                                  languageProvider
                                      .translate('translate_doctor'),
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w300),
                                ),
                                Text(
                                  languageProvider.translate('listen_doctor'),
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w300),
                                ),
                              ],
                            ),
                            SizedBox(
                              width: 5,
                            ),
                            Icon(
                              Icons.arrow_forward_ios,
                              color: Colors.white,
                            ),
                            SizedBox(width: 10)
                          ],
                        )
                      ],
                    ),
                  ),
                  SizedBox(height: 20),
                  Boxes(
                    texts: texts,
                    isHighContrast: highContrastMode?.isHighContrast ?? false,
                  ),
                  SizedBox(height: 15),
                  Center(
                    child: Container(
                      width: MediaQuery.of(context).size.width * 0.95,
                      child: AuraBox(
                        spots: [
                          AuraSpot(
                            color:
                                Color.fromRGBO(186, 2, 57, 1).withOpacity(0.3),
                            radius: 90.0,
                            alignment: Alignment.topLeft,
                            blurRadius: 30.0,
                            stops: const [0.0, 0.7],
                          ),
                          AuraSpot(
                            color:
                                Color.fromRGBO(28, 175, 87, 1).withOpacity(0.2),
                            radius: 110.0,
                            alignment: Alignment.bottomRight,
                            blurRadius: 40.0,
                            stops: const [0.0, 0.7],
                          ),
                          AuraSpot(
                            color: Color.fromRGBO(118, 116, 200, 1)
                                .withOpacity(0.4),
                            radius: 100.0,
                            alignment: Alignment(-0.4, 1.0),
                            blurRadius: 40.0,
                            stops: const [0.0, 0.7],
                          ),
                        ],
                        decoration: BoxDecoration(
                          color: Colors.transparent,
                          shape: BoxShape.rectangle,
                          borderRadius: BorderRadius.circular(30.0),
                          border: Border.all(color: Colors.black12, width: 2),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    languageProvider.translate('integrate'),
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w800,
                                      color:
                                          const Color.fromARGB(255, 71, 71, 71),
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 20),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 100,
                                    height: 100,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(30),
                                      color: Colors.white,
                                      border: Border.all(
                                        color: Colors.black12,
                                        width: 2,
                                      ),
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(20),
                                      child: Center(
                                        child: Image.asset(
                                            'assets/images/epic.png'),
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  Container(
                                    width: 100,
                                    height: 100,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(30),
                                      color: Colors.white,
                                      border: Border.all(
                                        color: Colors.black12,
                                        width: 2,
                                      ),
                                    ),
                                    child: Center(
                                      child: Image.asset(
                                        'assets/images/gemini.png',
                                        width:
                                            60, // Adjust the width and height
                                        height: 60,
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  Container(
                                    width: 100,
                                    height: 100,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(30),
                                      color: Colors.white,
                                      border: Border.all(
                                        color: Colors.black12,
                                        width: 2,
                                      ),
                                    ),
                                    child: Center(
                                      child: Image.asset(
                                          'assets/images/googlefit.png'),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  void _showMic() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MicPage(userName: _firstName),
      ),
    );
  }
}
