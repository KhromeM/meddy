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
import 'package:meddymobile/utils/languages.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:math';

List<String>? _storedHealthTips;

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

    wsConnection = WSConnection();
    playerService = PlayerService(wsConnection);
    recorderService = RecorderService(wsConnection);

    _firstName = _authService.getFirstName() ?? 'User';

    wsConnection.connect();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (Provider.of<ChatProvider>(context, listen: false).messages.isEmpty) {
        print('Loading chat history in MyHomePage...');
        Provider.of<ChatProvider>(context, listen: false).loadChatHistory();
      }
    });

    if (_storedHealthTips == null) {
      _fetchAndStoreHealthTips();
    } else {
      _logHealthTipLength();
    }
  }

  Future<void> _fetchAndStoreHealthTips() async {
    final String baseUrl = 'https://trymeddy.com/api';
    String? userToken = await _authService.getIdToken();

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/info/tip'),
        headers: {'idToken': userToken ?? ''},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _storedHealthTips = List<String>.from(data['tips']);
          _logHealthTipLength();
        });
      } else {
        throw Exception('Failed to load health tips');
      }
    } catch (error) {
      print('Error fetching health tips: $error');
    }
  }

  void _logHealthTipLength() {
    if (_storedHealthTips != null && _storedHealthTips!.isNotEmpty) {
      final randomTip = _getRandomTip();
      print('Random Health Tip Length: ${randomTip.length}');
    }
  }

  String _getRandomTip() {
    final random = Random();
    if (_storedHealthTips != null && _storedHealthTips!.isNotEmpty) {
      String tip =
          _storedHealthTips![random.nextInt(_storedHealthTips!.length)];
      return _truncateTip(tip);
    }
    return 'No health tips available';
  }

  String _truncateTip(String tip) {
    if (tip.length > 110) {
      return tip.substring(0, 110) + '...';
    }
    return tip;
  }

  @override
  void dispose() {
    playerService.dispose();
    recorderService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;

    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Stack(
          children: [
            Scaffold(
              extendBodyBehindAppBar: true,
              backgroundColor:
                  isHighContrast ? Colors.white : Colors.transparent,
              appBar: CustomAppBar(),
              body: LayoutBuilder(
                builder: (context, constraints) {
                  double availableHeight = constraints.maxHeight -
                      (MediaQuery.of(context).size.height * 0.07) -
                      100 -
                      40;

                  double meddyTipHeight = availableHeight * 2.5 / 10;

                  return Column(
                    children: [
                      SizedBox(
                          height: MediaQuery.of(context).size.height * 0.07),
                      Padding(
                        padding: const EdgeInsets.only(left: 20),
                        child: Row(
                          children: [
                            Text(
                              languageProvider.translate('hello'),
                              style: TextStyle(
                                  fontSize: 40,
                                  color: isHighContrast
                                      ? Colors.black
                                      : Color(0xFF0E3C26)),
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
                                  color: isHighContrast
                                      ? Colors.black
                                      : Color(0xFF0E3C26)),
                            )
                          ],
                        ),
                      ),
                      SizedBox(
                          height: MediaQuery.of(context).size.height * 0.02),
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
                                color: isHighContrast
                                    ? Colors.white
                                    : Color.fromRGBO(1, 99, 218, 1),
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
                                          color: isHighContrast
                                              ? Colors.black
                                              : Colors.white,
                                        ),
                                        Icon(Icons.phone_in_talk,
                                            color: isHighContrast
                                                ? Colors.white
                                                : Color.fromRGBO(1, 99, 218, 1),
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
                                          color: isHighContrast
                                              ? Colors.black
                                              : Colors.white,
                                          fontWeight: FontWeight.w700,
                                          fontSize: isHighContrast ? 20 : 16),
                                    ),
                                    Text(
                                      languageProvider
                                          .translate('translate_doctor'),
                                      style: TextStyle(
                                          color: isHighContrast
                                              ? Colors.black
                                              : Colors.white,
                                          fontWeight: FontWeight.w300,
                                          fontSize: isHighContrast ? 16 : 14),
                                    ),
                                    Text(
                                      languageProvider
                                          .translate('listen_doctor'),
                                      style: TextStyle(
                                          color: isHighContrast
                                              ? Colors.black
                                              : Colors.white,
                                          fontWeight: FontWeight.w300,
                                          fontSize: isHighContrast ? 16 : 14),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  width: 5,
                                ),
                                Icon(
                                  Icons.arrow_forward_ios,
                                  color: isHighContrast
                                      ? Colors.black
                                      : Colors.white,
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
                        isHighContrast: isHighContrast,
                      ),
                      Spacer(),
                      if (_storedHealthTips != null)
                        Container(
                          width: MediaQuery.of(context).size.width * 0.9,
                          height: meddyTipHeight,
                          decoration: BoxDecoration(
                            color: isHighContrast
                                ? Colors.black
                                : Color(0xFFF5E9DB),
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
                          child: Row(
                            children: [
                              Expanded(
                                flex: 2,
                                child: Padding(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 8),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Meddy Health Tip:",
                                        style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: isHighContrast
                                              ? Colors.white
                                              : Color(0xFF0E3C26),
                                        ),
                                      ),
                                      SizedBox(height: 8),
                                      Text(
                                        _getRandomTip(),
                                        style: TextStyle(
                                          fontSize: 16,
                                          color: isHighContrast
                                              ? Colors.white
                                              : Color(0xFF0E3C26),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              Container(
                                width: MediaQuery.of(context).size.width * 0.25,
                                height: double.infinity,
                                child: ClipRRect(
                                  borderRadius: BorderRadius.only(
                                    topRight: Radius.circular(20),
                                    bottomRight: Radius.circular(20),
                                  ),
                                  child: Image.asset(
                                    'assets/images/c9.webp',
                                    fit: BoxFit.cover,
                                    color: Colors.black.withOpacity(isHighContrast
                                        ? 0.5
                                        : 0.3), // Opacity changes based on high contrast mode
                                    colorBlendMode: BlendMode.darken,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        CircularProgressIndicator(),
                      Spacer(),
                    ],
                  );
                },
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
