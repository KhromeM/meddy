import 'dart:async';
import 'dart:convert';
import 'package:just_audio/just_audio.dart';
import 'package:meddymobile/utils/ws_connection.dart';

class PlayerService {
  final WSConnection _wsConnection;
  final AudioPlayer _audioPlayer = AudioPlayer();
  ConcatenatingAudioSource _audioChunkPlaylist =
      ConcatenatingAudioSource(children: []);
  bool _isPlaying = false;

  PlayerService(this._wsConnection) {
    _wsConnection.setHandler('audio_3', _handleAudioMessage);
    _audioPlayer.setAudioSource(_audioChunkPlaylist,
        initialIndex: 0, initialPosition: Duration.zero);
  }

  void _handleAudioMessage(Map<String, dynamic> message) {
    if (message['audio'] != null) {
      final audioData = base64Decode(message['audio']);
      _audioChunkPlaylist.add(MyAudioSource(audioData));
    }
  }

  void playQueuedAudio() {
    Timer.periodic(Duration(milliseconds: 100), (Timer timer) async {
      if (_isPlaying) return;
      while (_audioChunkPlaylist.length > 0) {
        _isPlaying = true;
        await _audioPlayer.play();
        _audioChunkPlaylist.removeAt(0);
      }
      _isPlaying = false;
    });
  }

  Future<void> stopPlayback() async {
    await _audioPlayer.stop();
    await _audioChunkPlaylist.clear();
    _isPlaying = false;
  }

  Future<void> dispose() async {
    await _audioPlayer.dispose();
  }
}

class MyAudioSource extends StreamAudioSource {
  final List<int> _buffer;

  MyAudioSource(this._buffer);

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
