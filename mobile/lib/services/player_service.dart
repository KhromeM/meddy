import 'dart:async';
import 'package:sound_stream/sound_stream.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'dart:convert';

class PlayerService {
  final WSConnection _wsConnection;
  final PlayerStream _player = PlayerStream();
  bool _isPlaying = false;
  StreamSubscription? _playerStatus;

  PlayerService(this._wsConnection) {
    _setupAudioMessageHandler();
    _initializePlayer();
  }

  Future<void> _initializePlayer() async {
    await _player.initialize();
    _playerStatus = _player.status.listen((status) {
      _isPlaying = status == SoundStreamStatus.Playing;
    });
  }

  void _setupAudioMessageHandler() {
    _wsConnection.setHandler('audio_3', _handleAudioMessage);
  }

  void _handleAudioMessage(Map<String, dynamic> message) {
    if (message['audio'] != null) {
      final audioData = base64Decode(message['audio']);
      _player.writeChunk(audioData);
    }
  }

  Future<void> playQueuedAudio() async {
    if (!_isPlaying) {
      await _player.start();
    }
  }

  Future<void> stopPlayback() async {
    await _player.stop();
    _isPlaying = false;
  }

  Future<void> dispose() async {
    await _player.stop();
    await _playerStatus?.cancel();
  }
}
