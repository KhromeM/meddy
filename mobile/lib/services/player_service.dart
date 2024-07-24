import 'dart:async';
import 'dart:convert';
import 'package:just_audio/just_audio.dart';
import 'package:meddymobile/utils/ws_connection.dart';

class PlayerService {
  final WSConnection _wsConnection;
  final AudioPlayer _audioPlayer = AudioPlayer();
  final List<String> _audioQueue = [];
  bool _isPlaying = false;
  Timer? _playbackTimer;
  static const int _maxWaitTime = 10000;
  static const int _checkInterval = 250;
  DateTime _prevEndTime = DateTime.now();

  PlayerService(this._wsConnection) {
    _setupAudioMessageHandler();
  }

  void _setupAudioMessageHandler() {
    _wsConnection.setHandler('audio_3', _handleAudioMessage);
  }

  void _handleAudioMessage(Map<String, dynamic> message) {
    if (message['audio'] != null) {
      _audioQueue.add(message['audio']);
    }
  }

  void playQueuedAudio() {
    if (!_isPlaying) {
      _playNextAudio();
      _startPlaybackTimer();
    }
  }

  void _startPlaybackTimer() {
    int totalTimeElapsed = 0;
    _playbackTimer =
        Timer.periodic(Duration(milliseconds: _checkInterval), (timer) {
      if (_isPlaying) {
        timer.cancel();
        return;
      }
      if (_audioQueue.isNotEmpty) {
        _playNextAudio();
        timer.cancel();
        return;
      }
      totalTimeElapsed += _checkInterval;
      if (totalTimeElapsed > _maxWaitTime) {
        timer.cancel();
      }
    });
  }

  Future<void> _playNextAudio() async {
    if (_audioQueue.isEmpty) {
      _isPlaying = false;
      return;
    }

    _isPlaying = true;
    final audioData = base64Decode(_audioQueue.removeAt(0));

    try {
      await _audioPlayer.setAudioSource(
        MyCustomSource(audioData),
        preload: false,
      );
      // await _audioPlayer.setSpeed(0.75); //adjust speed
      print(
          "MS since the last audio played: ${DateTime.now().difference(_prevEndTime).inMilliseconds}");
      await _audioPlayer.play();
      await _audioPlayer.playerStateStream.firstWhere(
        (state) => state.processingState == ProcessingState.completed,
      );
      _prevEndTime = DateTime.now();

      await _playNextAudio();
    } catch (e) {
      print('Error playing audio: $e');
      await _playNextAudio();
    }
  }

  Future<void> stopPlayback() async {
    await _audioPlayer.stop();
    _audioQueue.clear();
    _isPlaying = false;
  }

  Future<void> dispose() async {
    await _audioPlayer.dispose();
  }
}

class MyCustomSource extends StreamAudioSource {
  final List<int> _buffer;

  MyCustomSource(this._buffer);

  @override
  Future<StreamAudioResponse> request([int? start, int? end]) async {
    start ??= 0;
    end ??= _buffer.length;
    return StreamAudioResponse(
      sourceLength: _buffer.length,
      contentLength: end - start,
      offset: start,
      stream: Stream.value(_buffer.sublist(start, end)),
      contentType: 'audio/mp3',
    );
  }
}

// import 'dart:async';
// import 'dart:convert';
// import 'package:just_audio/just_audio.dart';
// import 'package:meddymobile/utils/ws_connection.dart';
// import 'package:async/async.dart'; // for StreamQueue

// class PlayerService {
//   final WSConnection _wsConnection;
//   final AudioPlayer _audioPlayer = AudioPlayer();
//   final _audioStreamController = StreamController<List<int>>();
//   late final _audioBuffer =
//       StreamQueue<List<int>>(_audioStreamController.stream);

//   PlayerService(this._wsConnection) {
//     _wsConnection.setHandler('audio_3', _handleAudioMessage);
//   }

//   void _handleAudioMessage(Map<String, dynamic> message) {
//     if (message['audio'] != null) {
//       final audioData = base64Decode(message['audio']);
//       _audioStreamController.add(audioData);
//     }
//   }

//   void playQueuedAudio() async {
//     await _audioPlayer.setAudioSource(
//       _AudioBufferSource(_audioBuffer),
//       initialIndex: 0,
//       initialPosition: Duration.zero,
//     );
//     await _audioPlayer.play();
//   }

//   Future<void> stopPlayback() async {
//     await _audioPlayer.stop();
//     _audioStreamController.close();
//   }

//   Future<void> dispose() async {
//     await _audioPlayer.dispose();
//   }
// }

// class _AudioBufferSource extends StreamAudioSource {
//   final StreamQueue<List<int>> _audioBuffer;

//   _AudioBufferSource(this._audioBuffer);

//   @override
//   Future<StreamAudioResponse> request([int? start, int? end]) async {
//     final audioData = await _audioBuffer.next;

//     final chunkSize = audioData.length;
//     final chunk = audioData;

//     return StreamAudioResponse(
//       sourceLength: chunkSize,
//       contentLength: chunkSize,
//       offset: 0,
//       stream: Stream.value(chunk),
//       contentType: 'audio/mp3',
//     );
//   }
// }
