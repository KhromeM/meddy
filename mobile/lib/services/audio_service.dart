import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:record/record.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:meddymobile/utils/ws_connection.dart';

class AudioService {
  final WSConnection _wsConnection;
  final AudioRecorder _recorder = AudioRecorder();
  StreamSubscription? _audioStreamSubscription;
  bool _isRecording = false;

  AudioService(this._wsConnection);

  Future<void> initialize() async {
    // No initialization needed for this package
  }

  Future<bool> toggleRecording() async {
    if (!_isRecording) {
      return await _startRecording();
    } else {
      return await _stopRecording();
    }
  }

  Future<bool> _startRecording() async {
    if (!await _recorder.hasPermission()) {
      print('Audio recording permission not granted');
      return false;
    }

    try {
      final stream = await _recorder.startStream(const RecordConfig(
        encoder: AudioEncoder.pcm16bits,
        numChannels: 1,
        sampleRate: 16000,
      ));

      _audioStreamSubscription = stream.listen((data) {
        _sendAudioChunk(data);
      });

      _isRecording = true;
      return true;
    } catch (e) {
      print('Error starting recorder: $e');
      return false;
    }
  }

  Future<bool> _stopRecording() async {
    try {
      await _recorder.stop();
      await _audioStreamSubscription?.cancel();
      _sendAudioComplete();
      _isRecording = false;
      return true;
    } catch (e) {
      print('Error stopping recorder: $e');
      return false;
    }
  }

  void _sendAudioChunk(Uint8List data) {
    print(data);
    if (_wsConnection.isConnected) {
      final base64Audio = base64Encode(data);
      final message = {
        'type': 'audio',
        'data': {
          'audioChunk': base64Audio,
          'mimeType': 'audio/pcm',
          'isComplete': false,
          'lang': 'en', // TODO: Make this dynamic based on user's language
        },
      };
      print("SENDING AUDIO TO SERVER: ${base64Audio.length}");
      _wsConnection.sendMessage(message);
    }
  }

  void _sendAudioComplete() {
    if (_wsConnection.isConnected) {
      _wsConnection.sendMessage({
        'type': 'audio',
        'data': {
          'isComplete': true,
        },
      });
    }
  }

  Future<void> dispose() async {
    await _stopRecording();
    _recorder.dispose();
  }

  bool get isRecording => _isRecording;
}
