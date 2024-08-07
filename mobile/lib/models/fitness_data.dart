class HealthData {
  final List<StepData> steps;
  final List<SleepData> sleep;
  final List<BpmData> bpm;

  HealthData({
    required this.steps,
    required this.sleep,
    required this.bpm,
  });

  factory HealthData.fromJson(Map<String, dynamic> json) {
    return HealthData(
      steps: (json['data']['data']['steps'] as List).map((e) => StepData.fromJson(e)).toList(),
      sleep: (json['data']['data']['sleep'] as List).map((e) => SleepData.fromJson(e)).toList(),
      bpm: (json['data']['data']['bpm'] as List).map((e) => BpmData.fromJson(e)).toList(),
    );
  }
}

class StepData {
  final DateTime date;
  final int steps;

  StepData({
    required this.date,
    required this.steps,
  });

  factory StepData.fromJson(Map<String, dynamic> json) {
    return StepData(
      date: DateTime.parse(json['date']),
      steps: json['steps'],
    );
  }
}

class SleepData {
  final DateTime date;
  final int totalSleepMinutes;
  final List<dynamic> sleepSegments;

  SleepData({
    required this.date,
    required this.totalSleepMinutes,
    required this.sleepSegments,
  });

  factory SleepData.fromJson(Map<String, dynamic> json) {
    return SleepData(
      date: DateTime.parse(json['date']),
      totalSleepMinutes: json['totalSleepMinutes'],
      sleepSegments: json['sleepSegments'],
    );
  }
}

class BpmData {
  final DateTime time;
  final int bpm;

  BpmData({
    required this.time,
    required this.bpm,
  });

  factory BpmData.fromJson(Map<String, dynamic> json) {
    return BpmData(
      time: DateTime.parse(json['time']),
      bpm: json['bpm'],
    );
  }
}