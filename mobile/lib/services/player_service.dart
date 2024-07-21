import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:path_provider/path_provider.dart';
import 'package:meddymobile/utils/ws_connection.dart';
import 'package:sound_stream/sound_stream.dart';
import 'package:ffmpeg_kit_flutter/ffmpeg_kit.dart';
import 'package:ffmpeg_kit_flutter/return_code.dart';

class PlayerService {
  final WSConnection _connection;
  final PlayerStream _playerStream = PlayerStream();
  bool _isInitialized = false;

  PlayerService(this._connection) {
    _initializeAudioStream();
    _connection.setHandler('audio_3', _handleAudioMessage);
  }

  Future<void> _initializeAudioStream() async {
    await _playerStream.initialize(sampleRate: 16000);
    _isInitialized = true;
  }

  void _handleAudioMessage(Map<String, dynamic> message) {
    print('Received Audio Message: $message');
    if (!_isInitialized) {
      print('PlayerStream is not initialized');
      return;
    }

    if (message['audio'] != null) {
      try {
        // Decode the base64 audio data
        final audioData = base64Decode(message['audio']);
        print(
            'Decoded audio data length: ${audioData.length}');

        // Inspect the first few bytes of the audio data
        print(
            'First few bytes of the audio data: ${audioData.sublist(0, 10)}');

        // Save the audio data to a temporary file
        _saveAudioDataToFile(audioData).then((filePath) {
          // Decode MP3 to PCM
          _decodeMp3ToPcm(filePath).then((pcmData) {
            if (pcmData != null) {
              _playerStream.writeChunk(pcmData);
              print('Audio data pushed to stream');
              _playerStream.start();
              print('Audio stream started');
            } else {
              print('Failed to decode MP3 to PCM');
            }
          });
        });
      } catch (e, stackTrace) {
        print('Error decoding audio data: $e');
        print(stackTrace);
      }
    } else {
      print('No audio data in message');
      _playerStream.stop();
      print('Audio stream stopped');
    }
  }

  Future<String> _saveAudioDataToFile(
      Uint8List audioData) async {
    final directory = await getTemporaryDirectory();
    final filePath = '${directory.path}/audio.mp3';
    final file = File(filePath);
    await file.writeAsBytes(audioData);
    return filePath;
  }

  Future<Uint8List?> _decodeMp3ToPcm(
      String filePath) async {
    final outputFilePath =
        filePath.replaceAll('.mp3', '.pcm');
    final command =
        '-y -i $filePath -f s16le -acodec pcm_s16le -ar 16000 -ac 1 $outputFilePath';

    final session = await FFmpegKit.execute(command);
    final returnCode = await session.getReturnCode();
    final output = await session.getOutput();
    final failStackTrace =
        await session.getFailStackTrace();
    final logs = await session.getLogs();

    print('FFmpeg process output: $output');
    if (failStackTrace != null) {
      print('FFmpeg process stack trace: $failStackTrace');
    }
    for (var log in logs) {
      print('FFmpeg log: ${log.getMessage()}');
    }

    if (ReturnCode.isSuccess(returnCode)) {
      final file = File(outputFilePath);
      return await file.readAsBytes();
    } else {
      print('FFmpeg process failed with rc=$returnCode');
      return null;
    }
  }

  Future<void> stopPlayback() async {
    _playerStream.stop();
  }

  Future<void> dispose() async {
    _playerStream.dispose();
    _connection.disconnect();
  }
}



// import 'dart:async';
// import 'dart:collection';
// import 'dart:convert';
// import 'dart:typed_data';
// import 'package:audioplayers/audioplayers.dart';
// import 'package:meddymobile/utils/ws_connection.dart';

// class PlayerService {
//   final WSConnection _wsConnection;
//   final AudioPlayer _audioPlayer = AudioPlayer();
//   final Queue<Uint8List> _audioQueue = Queue<Uint8List>();
//   bool _isPlaying = false;
//   Completer<void>? _playbackCompleter;

//   PlayerService(this._wsConnection) {
//     _wsConnection.setHandler('audio_3', (message) {
//       _handleAudioMessage(message);
//     });

//     _audioPlayer.onPlayerComplete.listen((event) {
//       _onPlaybackComplete();
//     });

//     _audioPlayer.onPlayerStateChanged.listen((state) {
//       print('Player state changed: $state');
//     });

//     _audioPlayer.onSeekComplete.listen((event) {
//       print('Seek completed');
//     });

//     _audioPlayer.onDurationChanged.listen((duration) {
//       print('Duration changed: $duration');
//     });

//     _audioPlayer.onLog.listen((message) {
//       print('Playback error: $message');
//       _isPlaying = false;
//       _audioQueue.clear();
//       _playbackCompleter?.completeError(message);
//     });
//   }

//   void _handleAudioMessage(Map<String, dynamic> message) async {
//     
//     if (message['audio'] != null) {
//       try {
//         final audioData = base64Decode(message['audio']);
//         print('Decoded audio data length: ${audioData.length}');
//         _audioQueue.add(Uint8List.fromList(audioData));
//         _tryPlayNextAudio();
//       } catch (e, stackTrace) {
        // print('Error decoding audio data: $e');
        // print(stackTrace);
//       }
//     } else if (message['isFinal'] == true) {
//       print('Received final audio message.');
//       _tryPlayNextAudio();
//     }
//   }

//   Future<void> _tryPlayNextAudio() async {
//     if (!_isPlaying && _audioQueue.isNotEmpty) {
//       final audioData = _audioQueue.removeFirst();
//       await _playAudioData(audioData);
//     }
//   }

//   Future<void> _playAudioData(Uint8List audioData) async {
//     final audioSource = BytesSource(audioData);

//     try {
//       _isPlaying = true;
//       _playbackCompleter = Completer<void>();
//       await _audioPlayer.play(audioSource);
//       await _playbackCompleter!.future;
//       print('Playback started successfully');
//     } catch (e, stackTrace) {
//       print('Error playing audio data: $e');
//       print(stackTrace);
//       _isPlaying = false;
//       _audioQueue.clear();
//     }
//   }

//   void _onPlaybackComplete() {
//     _isPlaying = false;
//     _playbackCompleter?.complete();
//     _tryPlayNextAudio();
//   }

//   Future<void> stopPlayback() async {
//     await _audioPlayer.stop();
//     _isPlaying = false;
//     _audioQueue.clear();
//     _playbackCompleter?.complete();
//   }

//   Future<void> dispose() async {
//     await _audioPlayer.dispose();
//   }
// }