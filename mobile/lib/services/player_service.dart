import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:audioplayers/audioplayers.dart';
import 'package:meddymobile/utils/ws_connection.dart';

class PlayerService {
  final WSConnection _wsConnection;
  final AudioPlayer _audioPlayer = AudioPlayer();
  final List<int> _audioBuffer = [];
  bool _isPlaying = false;

  PlayerService(this._wsConnection) {
    _wsConnection.setHandler('audio_3', (message) {
      _handleAudioMessage(message);
    });

    _audioPlayer.onPlayerComplete.listen((event) {
      _isPlaying = false;
      print('Playback completed');
    });

    _audioPlayer.onPlayerStateChanged.listen((state) {
      print('Player state changed: $state');
    });

    _audioPlayer.onSeekComplete.listen((event) {
      print('Seek completed');
    });

    _audioPlayer.onDurationChanged.listen((duration) {
      print('Duration changed: $duration');
    });

    _audioPlayer.onLog.listen((message) {
      print('Playback error: $message');
      _isPlaying = false;
    });
  }

  void _handleAudioMessage(
      Map<String, dynamic> message) async {
    print('Received Audio Message: $message');
    if (message['audio'] != null) {
      try {
        final audioData = base64Decode(message['audio']);
        print(
            'Decoded audio data length: ${audioData.length}');
        _audioBuffer.addAll(audioData);
      } catch (e, stackTrace) {
        print('Error decoding audio data: $e');
        print(stackTrace);
      }
    } else {
      if (message['isFinal'] == true) {
        print('Received final audio message.');
        await _playBufferedAudio();
      }
    }
  }

  Future<void> _playBufferedAudio() async {
    if (_audioBuffer.isNotEmpty) {
      final byteData = Uint8List.fromList(_audioBuffer);
      final audioSource = BytesSource(byteData);

      try {
        await _audioPlayer.play(audioSource);
        _isPlaying = true;
        print('Playback started successfully');
      } catch (e, stackTrace) {
        print('Error playing audio data: $e');
        print(stackTrace);
        await stopPlayback();
      }
    }
  }

  Future<void> playAudio() async {
    if (!_isPlaying) {
      await _playBufferedAudio();
    }
  }

  Future<void> stopPlayback() async {
    await _audioPlayer.stop();
    _isPlaying = false;
    _audioBuffer.clear();
  }

  Future<void> dispose() async {
    await _audioPlayer.dispose();
  }
}
