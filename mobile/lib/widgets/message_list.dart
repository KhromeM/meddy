import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:meddymobile/models/message.dart';
import 'package:meddymobile/widgets/high_contrast_mode.dart';
import 'package:skeletonizer/skeletonizer.dart';

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
    final bool isHighContrast = highContrastMode?.isHighContrast ?? false;
    final screenWidth = MediaQuery.of(context).size.width;
    final userMessageWidth = screenWidth * 2 / 3;
    final llmMessageWidth = screenWidth * 4 / 5;

    // Adjust text size based on high contrast mode
    double textSize = isHighContrast ? 20.0 : 16.0;

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
            textColor = Color(0xFF0E3C26);
            resultIcon = Icons.error;
            iconColor = Colors.red;
          }
        } else {
          messageColor = isUser
              ? (isHighContrast
                  ? const Color.fromARGB(255, 77, 77, 77)
                  : Color(0xFFF5E9DB))
              : (isHighContrast ? Colors.black : Color(0xFFFAF3EA));

          textColor = isHighContrast ? Colors.white : Color(0xFF0E3C26);
        }

        return Align(
          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            child: Column(
              crossAxisAlignment:
                  isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                if (message.imageID != null)
                  FutureBuilder<Uint8List?>(
                    future: fetchImage(message.imageID!),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return ClipRRect(
                          borderRadius: BorderRadius.circular(16.0),
                          child: Skeletonizer(
                            child: Container(
                              width: 100,
                              height: 130,
                              color: Color.fromARGB(255, 18, 8, 8),
                            ),
                          ),
                        );
                      } else if (snapshot.hasError) {
                        return Text('Error loading image');
                      } else if (snapshot.hasData) {
                        return Padding(
                          padding: EdgeInsets.only(right: isUser ? 10.0 : 0),
                          child: GestureDetector(
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
                          ),
                        );
                      } else {
                        return Text('Image not available');
                      }
                    },
                  ),
                Row(
                  mainAxisAlignment:
                      isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (!isUser)
                      Padding(
                        padding: const EdgeInsets.only(
                            left: 8.0, right: 8.0, top: 10),
                        child: SvgPicture.asset(
                          'assets/images/logo_image.svg',
                          width: isHighContrast
                              ? 28
                              : 24, // Adjust the width as needed
                          height: isHighContrast
                              ? 28
                              : 24, // Adjust the height as needed
                        ),
                      ),
                    Container(
                      key: ValueKey(message.messageId),
                      constraints: BoxConstraints(
                          maxWidth: isUser
                              ? userMessageWidth
                              : llmMessageWidth - 32), // Subtract padding
                      padding: EdgeInsets.symmetric(
                          vertical: 10.0, horizontal: 15.0), // user chat boxes
                      margin: EdgeInsets.symmetric(vertical: 0, horizontal: 0),
                      decoration: BoxDecoration(
                        color: messageColor,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (message.text.isNotEmpty)
                            MarkdownBody(
                              data: message.text,
                              styleSheet: MarkdownStyleSheet(
                                p: TextStyle(
                                    color: textColor,
                                    fontSize: textSize,
                                    fontWeight: FontWeight.w500),
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
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
