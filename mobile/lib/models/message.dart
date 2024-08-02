class Message {
  final String messageId;
  final String userId;
  final String source;
  final String? imageID;
  final String text;
  final DateTime time;
  final Map<String, dynamic>? result;

  Message({
    required this.messageId,
    required this.userId,
    required this.source,
    this.imageID,
    required this.text,
    required this.time,
    this.result,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    // print(json);
    return Message(
      messageId: json['messageid'].toString(),
      userId: json['userid'],
      source: json['source'],
      imageID: json['imageid'],
      text: json['text'],
      time: DateTime.parse(json['time']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'messageid': messageId,
      'userid': userId,
      'source': source,
      'imageID': imageID,
      'text': text,
      'time': time.toIso8601String(),
    };
  }

  Message copyWith({
    String? messageId,
    String? userId,
    String? source,
    String? imageID,
    String? text,
    DateTime? time,
    Map<String, dynamic>? result,
  }) {
    return Message(
      messageId: messageId ?? this.messageId,
      userId: userId ?? this.userId,
      source: source ?? this.source,
      imageID: imageID ?? this.imageID,
      text: text ?? this.text,
      time: time ?? this.time,
      result: result ?? this.result,
    );
  }
}
