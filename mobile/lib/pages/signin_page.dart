import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meddymobile/pages/screen_wrapper.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/login_background.dart';
import 'package:meddymobile/widgets/spinning_logo.dart';
import 'package:meddymobile/pages/my_home_page.dart';

class SignInPage extends ConsumerStatefulWidget {
  const SignInPage({super.key});

  @override
  ConsumerState<SignInPage> createState() => _SignInState();
}

class _SignInState extends ConsumerState<SignInPage> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleSignIn() async {
    setState(() {
      _isLoading = true;
    });

    try {
      User? user = await _authService.signInWithGoogle();
      if (user != null) {
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const ScreenWrapper(),
            ),
          );
        }
      } else {
        _showSnackBar("Sign-in failed. Please try again.");
      }
    } catch (e) {
      _showSnackBar(e.toString());
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          LoginBackground(),
          Center(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(height: 200),
                  Text(
                    "Meddy",
                    style: TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: Color.fromRGBO(75, 87, 104, 1.0),
                    ),
                  ),
                  SizedBox(height: 200),
                  _isLoading
                      ? SpinningLogo(
                          initialSpeed: 1.0,
                          height: 100,
                          width: 100,
                          isVary: true,
                        )
                      : SignInButton(onTap: _handleSignIn),
                  SizedBox(height: 40),
                  const Spacer(flex: 1),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SignInButton extends StatelessWidget {
  final VoidCallback onTap;

  const SignInButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 350,
        height: 56,
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: Color.fromRGBO(255, 184, 76, 1),
            width: 4,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/google_signin_button.png',
              height: 24,
              width: 24,
            ),
            SizedBox(width: 12),
            Text(
              "Continue with Google",
              style: TextStyle(
                color: Color.fromRGBO(75, 87, 104, 1.0),
                fontSize: 20,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
