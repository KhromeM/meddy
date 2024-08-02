import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';

class MessageList extends StatelessWidget {
  final List<Message> messages;
  final ScrollController scrollController;
  final Future<Uint8List?> Function(String) fetchImage;

  MessageList({
    required this.messages,
    required this.scrollController,
    required this.fetchImage,
  });

  @override
  Widget build(BuildContext context) {
    final highContrastMode = HighContrastMode.of(context);

    return ListView.builder(
      controller: scrollController,
      itemCount: messages.length,
      physics: ClampingScrollPhysics(),
      itemBuilder: (context, index) {
        final message = messages[index];
        final isUser = message.source == "user";

        Color messageColor;
        Color textColor;
        IconData? resultIcon;
        Color? iconColor;

        if (message.result != null) {
          if (message.result!['success'] == true) {
            messageColor = Colors.green[100]!;
            textColor = Colors.black;
            resultIcon = Icons.check_circle;
            iconColor = Colors.green;
          } else {
            messageColor = Colors.red[100]!;
            textColor = Colors.black;
            resultIcon = Icons.error;
            iconColor = Colors.red;
          }
        } else {
          messageColor = isUser
              ? Color.fromRGBO(255, 254, 251, 1)
              : Color.fromRGBO(255, 242, 228, 1);
          textColor = Colors.black;
        }

        return Align(
          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Container(
              key: ValueKey(message.messageId),
              decoration: BoxDecoration(
                color: messageColor,
                borderRadius: BorderRadius.circular(20),
              ),
              padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 15.0),
              margin: EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (message.imageID != null)
                    FutureBuilder<Uint8List?>(
                      future: fetchImage(message.imageID!),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return CircularProgressIndicator();
                        } else if (snapshot.hasError) {
                          return Text('Error loading image');
                        } else if (snapshot.hasData) {
                          return GestureDetector(
                            onTap: () {
                              showDialog(
                                context: context,
                                builder: (context) {
                                  return Dialog(
                                    child: ConstrainedBox(
                                      constraints: BoxConstraints(
                                        maxWidth:
                                            MediaQuery.of(context).size.width *
                                                0.8,
                                        maxHeight:
                                            MediaQuery.of(context).size.height *
                                                0.8,
                                      ),
                                      child: SingleChildScrollView(
                                        child: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(16.0),
                                              child: Image.memory(
                                                snapshot.data!,
                                                fit: BoxFit.fill,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              );
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(16.0),
                              child: Image.memory(
                                snapshot.data!,
                                width: 100,
                                height: 130,
                                fit: BoxFit.fill,
                                gaplessPlayback: true,
                              ),
                            ),
                          );
                        } else {
                          return Text('Image not available');
                        }
                      },
                    ),
                  if (message.text.isNotEmpty)
                    MarkdownBody(
                      data: message.text,
                      styleSheet: MarkdownStyleSheet(
                        p: TextStyle(color: textColor),
                      ),
                    ),
                  if (resultIcon != null)
                    Padding(
                      padding: EdgeInsets.only(top: 8.0),
                      child: Icon(
                        resultIcon,
                        color: iconColor,
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
