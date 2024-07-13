import 'ws_connection.dart'; // Assuming your class is in a file named ws_connection.dart

void main() async {
  WSConnection connection = WSConnection();

  try {
    await connection.connect();

    if (connection.isConnected) {
      print("CONNECTED");
    } else {
      print("Failed to connect");
    }
  } catch (e) {
    print("An error occurred: $e");
  }
}
