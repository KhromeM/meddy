class Message {
  final String messageId;
  final String userId;
  final String source;
  final String text;
  final DateTime time;

  Message({
    required this.messageId,
    required this.userId,
    required this.source,
    required this.text,
    required this.time,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      messageId: json['messageid'],
      userId: json['userid'],
      source: json['source'],
      text: json['text'],
      time: DateTime.parse(json['time']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'messageid': messageId,
      'userid': userId,
      'source': source,
      'text': text,
      'time': time.toIso8601String(),
    };
  }

  Message copyWith({
    String? messageId,
    String? userId,
    String? source,
    String? text,
    DateTime? time,
  }) {
    return Message(
      messageId: messageId ?? this.messageId,
      userId: userId ?? this.userId,
      source: source ?? this.source,
      text: text ?? this.text,
      time: time ?? this.time,
    );
  }
}
