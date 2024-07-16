// import 'dart:async';
import 'dart:convert';
// import 'package:just_audio/just_audio.dart';
// import 'package:meddymobile/utils/ws_connection.dart';

// class PlayerService {
//   final WSConnection _wsConnection;
//   final AudioPlayer _audioPlayer = AudioPlayer();
//   ConcatenatingAudioSource _audioChunkPlaylist =
//       ConcatenatingAudioSource(children: []);
//   bool _isPlaying = false;

//   PlayerService(this._wsConnection) {
//     _wsConnection.setHandler('audio_3', _handleAudioMessage);
//     _audioPlayer.setAudioSource(_audioChunkPlaylist,
//         initialIndex: 0, initialPosition: Duration.zero);
//   }

//   void _handleAudioMessage(Map<String, dynamic> message) {
//     if (message['audio'] != null) {
//       final audioData = base64Decode(message['audio']);
//       _audioChunkPlaylist.add(MyAudioSource(audioData));
//     }
//   }

//   void playQueuedAudio() {
//     Timer.periodic(Duration(milliseconds: 100), (Timer timer) async {
//       if (_isPlaying) return;
//       while (_audioChunkPlaylist.length > 0) {
//         _isPlaying = true;
//         await _audioPlayer.play();
//         _audioChunkPlaylist.removeAt(0);
//       }
//       _isPlaying = false;
//     });
//   }

//   Future<void> stopPlayback() async {
//     await _audioPlayer.stop();
//     await _audioChunkPlaylist.clear();
//     _isPlaying = false;
//   }

//   Future<void> dispose() async {
//     await _audioPlayer.dispose();
//   }
// }

// class MyAudioSource extends StreamAudioSource {
//   final List<int> _buffer;

//   MyAudioSource(this._buffer);

//   @override
//   Future<StreamAudioResponse> request([int? start, int? end]) async {
//     start ??= 0;
//     end ??= _buffer.length;
//     return StreamAudioResponse(
//       sourceLength: _buffer.length,
//       contentLength: end - start,
//       offset: start,
//       stream: Stream.value(_buffer.sublist(start, end)),
//       contentType: 'audio/mp3',
//     );
//   }
// }

import 'dart:async';
import 'dart:typed_data';
import 'package:just_audio/just_audio.dart';
import 'package:meddymobile/utils/ws_connection.dart';

class PlayerService {
  final WSConnection _wsConnection;
  final AudioPlayer _audioPlayer = AudioPlayer();
  final AppAudioStreamSource _audioSource = AppAudioStreamSource();
  bool _isPlaying = false;
  bool _isSourceSet = false;

  PlayerService(this._wsConnection) {
    _wsConnection.setHandler('audio_3', _handleAudioMessage);
    _audioPlayer.playerStateStream.listen(_onPlayerStateChanged);
  }

  void _handleAudioMessage(Map<String, dynamic> message) async {
    if (message['audio'] != null) {
      final audioData = base64Decode(message['audio']);
      _audioSource.addBytes(audioData);

      if (!_isSourceSet) {
        await _audioPlayer.setAudioSource(_audioSource);
        _isSourceSet = true;
      }
      // comment out when implementing tiered audio
      if (!_isPlaying) {
        _audioPlayer.play();
      }
    }
  }

  void _onPlayerStateChanged(PlayerState state) {
    if (state.playing) {
      _isPlaying = true;
    } else if (state.processingState == ProcessingState.completed) {
      _isPlaying = false;
    }
  }

  void playQueuedAudio() {
    if (!_isPlaying && _isSourceSet) {
      _audioPlayer.play();
    }
  }

  Future<void> stopPlayback() async {
    await _audioPlayer.stop();
    _isPlaying = false;
    _audioSource.clear();
    _isSourceSet = false;
  }

  Future<void> dispose() async {
    await _audioPlayer.dispose();
    _audioSource.close();
  }
}

class AppAudioStreamSource extends StreamAudioSource {
  AppAudioStreamSource(); // why? what does this do?

  final _controller = StreamController<List<int>>.broadcast(); // what is this?
  final List<int> _buffer = [];
  int _totalLength = 0;

  void addBytes(List<int> chunk) {
    if (!_controller.isClosed) {
      _buffer.addAll(chunk);
      _totalLength += chunk.length;
      _controller.add(chunk);
    }
  }

  void clear() {
    _buffer.clear();
    _totalLength = 0;
  }

  void close() {
    _controller.close();
  }

  @override
  Future<StreamAudioResponse> request([int? start, int? end]) async {
    start ??= 0;
    end = _totalLength; // Use the current total length

    return StreamAudioResponse(
      sourceLength: _totalLength, // Use the current total length
      contentLength: end - start,
      offset: start,
      stream: _controller.stream.map((event) {
        // What is this?
        final Uint8List bytes = Uint8List.fromList(event);
        // Ensure we don't exceed the contentLength (why would we ever?)
        if (start! + bytes.length > end!) {
          return bytes.sublist(start!, end);
        }
        start = start! + bytes.length;
        return bytes;
      }),
      contentType: 'audio/mp3',
    );
  }
}

// class AppAudioStreamSource extends StreamAudioSource {
//   final List<int> _buffer = [];
//   int _totalLength = 0;

//   void addBytes(List<int> chunk) {
//     _buffer.addAll(chunk);
//     _totalLength += chunk.length;
//   }

//   void clear() {
//     _buffer.clear();
//     _totalLength = 0;
//   }

//   @override
//   Future<StreamAudioResponse> request([int? start, int? end]) async {
//     start ??= 0;
//     end ??= _totalLength;

//     // Ensure we don't exceed the buffer length
//     end = end > _totalLength ? _totalLength : end;

//     final contentLength = end - start;

//     return StreamAudioResponse(
//       sourceLength: _totalLength,
//       contentLength: contentLength,
//       offset: start,
//       stream: Stream.value(Uint8List.fromList(_buffer.sublist(start, end))),
//       contentType: 'audio/mp3',
//     );
//   }
// }
