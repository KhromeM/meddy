class MedicalRecord {
  final HealthDetail metabolicHealth;
  final HealthDetail heartHealth;
  final HealthDetail gutHealth;
  final HealthDetail brainHealth;
  final HealthDetail immuneSystem;
  final HealthDetail musculoskeletalHealth;
  final HealthDetail hormonalProfile;
  final Summary summary;

  MedicalRecord({
    required this.metabolicHealth,
    required this.heartHealth,
    required this.gutHealth,
    required this.brainHealth,
    required this.immuneSystem,
    required this.musculoskeletalHealth,
    required this.hormonalProfile,
    required this.summary,
  });

  factory MedicalRecord.fromJson(Map<String, dynamic> json) {
    return MedicalRecord(
      metabolicHealth: HealthDetail.fromJson(json['metabolicHealth']),
      heartHealth: HealthDetail.fromJson(json['heartHealth']),
      gutHealth: HealthDetail.fromJson(json['gutHealth']),
      brainHealth: HealthDetail.fromJson(json['brainHealth']),
      immuneSystem: HealthDetail.fromJson(json['immuneSystem']),
      musculoskeletalHealth: HealthDetail.fromJson(json['musculoskeletalHealth']),
      hormonalProfile: HealthDetail.fromJson(json['hormonalProfile']),
      summary: Summary.fromJson(json['summary']),
    );
  }
}

class HealthDetail {
  final String name;
  final int? score;
  final String oneLineSummary;
  final String generalRecommendation;
  final ActionPlan actionPlan;
  final Details details;

  HealthDetail({
    required this.name,
    this.score,
    required this.oneLineSummary,
    required this.generalRecommendation,
    required this.actionPlan,
    required this.details,
  });

  factory HealthDetail.fromJson(Map<String, dynamic> json) {
    return HealthDetail(
      name: json['name'],
      score: json['score'],
      oneLineSummary: json['oneLineSummary'],
      generalRecommendation: json['generalRecommendation'],
      actionPlan: ActionPlan.fromJson(json['actionPlan']),
      details: Details.fromJson(json['details']),
    );
  }
}

class ActionPlan {
  final List<String> longTerm;
  final List<String> shortTerm;

  ActionPlan({required this.longTerm, required this.shortTerm});

  factory ActionPlan.fromJson(Map<String, dynamic> json) {
    return ActionPlan(
      longTerm: List<String>.from(json['longTerm']),
      shortTerm: List<String>.from(json['shortTerm']),
    );
  }
}

class Details {
  final TestDetail goldTest;
  final List<TestDetail> secondaryTests;

  Details({required this.goldTest, required this.secondaryTests});

  factory Details.fromJson(Map<String, dynamic> json) {
    return Details(
      goldTest: TestDetail.fromJson(json['goldTest']),
      secondaryTests: (json['secondaryTests'] as List)
          .map((i) => TestDetail.fromJson(i))
          .toList(),
    );
  }
}

class TestDetail {
  final String name;
  final String range;
  final String recommendation;
  final String result;

  TestDetail({
    required this.name,
    required this.range,
    required this.recommendation,
    required this.result,
  });

  factory TestDetail.fromJson(Map<String, dynamic> json) {
    return TestDetail(
      name: json['name'],
      range: json['range'],
      recommendation: json['recommendation'],
      result: json['result'],
    );
  }
}

class Summary {
  final String summary;

  Summary({required this.summary});

  factory Summary.fromJson(Map<String, dynamic> json) {
    return Summary(
      summary: json['summary'],
    );
  }
}
