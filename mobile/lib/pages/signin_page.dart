import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:meddymobile/services/auth_service.dart';
import 'package:meddymobile/widgets/login_background.dart';
import 'package:meddymobile/pages/my_home_page.dart';

class SignInPage extends ConsumerStatefulWidget {
  const SignInPage({super.key});

  @override
  ConsumerState<SignInPage> createState() => _SignInState();
}

class _SignInState extends ConsumerState<SignInPage> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

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
                  // Logo
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
                      ? CircularProgressIndicator()
                      : GestureDetector(
                          onTap: () async {
                            // Handle Google sign-in
                            setState(() {
                              _isLoading = true; // Set loading state to true
                            });
                            try {
                              await _authService.signInWithGoogle();
                              if (mounted) {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => const MyHomePage()),
                                );
                              }
                            } catch (e) {
                              if (!mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(e.toString())));
                            } finally {
                              setState(() {
                                _isLoading =
                                    false; // Set loading state to false
                              });
                            }
                          },
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
                                  'assets/images/google_signin_button.png', // Replace with the path to your Google logo asset
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
                        ),
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
