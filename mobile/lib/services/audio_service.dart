import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:meddymobile/utils/ws_connection.dart';

class AudioService {
  final WSConnection _wsConnection;
  FlutterSoundRecorder? _recorder;
  StreamSubscription? _recorderSubscription;
  bool _isRecording = false;

  AudioService(this._wsConnection);

  Future<void> initialize() async {
    _recorder = FlutterSoundRecorder();
    await _recorder!.openRecorder();
  }

  Future<bool> toggleRecording() async {
    var status = await Permission.microphone.status;
    print(status);
    if (!_isRecording) {
      var status = await Permission.microphone.request();
      if (status != PermissionStatus.granted) {
        print('Microphone permission not granted');
        return false;
      }

      // await _startRecording();
    } else {
      // await _stopRecording();
    }

    _isRecording = !_isRecording;
    return _isRecording;
  }

  // Future<void> _startRecording() async {
  //   try {
  //     await _recorder!.startRecorder(
  //       toStream: (Uint8List data) {
  //         _sendAudioChunk(data);
  //       },
  //       codec: Codec.pcm16,
  //       numChannels: 1,
  //       sampleRate: 16000,
  //     );
  //   } catch (e) {
  //     print('Error starting recorder: $e');
  //   }
  // }

  // Future<void> _stopRecording() async {
  //   try {
  //     await _recorder!.stopRecorder();
  //     _sendAudioComplete();
  //   } catch (e) {
  //     print('Error stopping recorder: $e');
  //   }
  // }

  // void _sendAudioChunk(Uint8List data) {
  //   if (_wsConnection.isConnected) {
  //     final base64Audio = base64Encode(data);
  //     _wsConnection.sendMessage({
  //       'type': 'audio',
  //       'data': {
  //         'audioChunk': base64Audio,
  //         'mimeType': 'audio/pcm',
  //         'isComplete': false,
  //         'lang': 'en', // TODO: Make this dynamic based on user's language
  //       },
  //     });
  //   }
  // }

  // void _sendAudioComplete() {
  //   if (_wsConnection.isConnected) {
  //     _wsConnection.sendMessage({
  //       'type': 'audio',
  //       'data': {
  //         'isComplete': true,
  //       },
  //     });
  //   }
  // }

  void dispose() {
    _recorder?.closeRecorder();
    _recorderSubscription?.cancel();
  }

  bool get isRecording => _isRecording;
}
