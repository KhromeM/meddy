import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  String? _cachedIdToken;

  Future<User?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        return null;
      }
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      final UserCredential userCredential =
          await _auth.signInWithCredential(credential);
      _cachedIdToken =
          await userCredential.user?.getIdToken(); // Cache the idToken
      return userCredential.user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
    await _googleSignIn.signOut();
    _cachedIdToken = null;
  }

  Future<String?> getIdToken() async {
    if (_cachedIdToken == null) {
      _cachedIdToken = await _auth.currentUser?.getIdToken();
    }
    return _cachedIdToken;
  }

  String? getFirstName() {
    return _auth.currentUser?.displayName?.split(' ')[0];
  }

  String? getProfileImageUrl() {
    return _auth.currentUser?.photoURL;
  }
}
