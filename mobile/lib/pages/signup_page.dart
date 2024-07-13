import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:meddymobile/services/auth_service.dart';

import '../main.dart';

class SignUpPage extends ConsumerStatefulWidget {
  const SignUpPage({super.key});

  @override
  ConsumerState<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends ConsumerState<SignUpPage> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(flex: 1),
              Image.asset(
                'assets/images/logo_text.png',
                width: 123,
                height: 61,
              ),
              const SizedBox(height: 24),
              Text(
                'Create an account to get your questions\nanswered and quickly scheduled.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Color.fromRGBO(0, 0, 0, 0.75),
                  fontWeight: FontWeight.w400,
                ),
              ),
              const Spacer(flex: 1),
              _isLoading
                  ? CircularProgressIndicator()
                  : GestureDetector(
                      onTap: () async {
                        setState(() {
                          _isLoading = true;
                        });
                        try {
                          await _authService.signUpWithGoogle();
                          // Navigate to home page or show success message
                          if (!mounted) return;
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                                builder: (context) => MyHomePage()),
                          );
                        } catch (e) {
                          if (!mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(e.toString())),
                          );
                        } finally {
                          setState(() {
                            _isLoading = false;
                          });
                        }
                      },
                      child: Container(
                        width: 300,
                        height: 56,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(30),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black12,
                              blurRadius: 5,
                              offset: Offset(0, 3),
                            ),
                          ],
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
                              "Sign up with Google",
                              style: TextStyle(
                                color: Color.fromRGBO(75, 87, 104, 1.0),
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
              SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text("Already have an account? "),
                  GestureDetector(
                    onTap: () {
                      // Navigate to sign-in page
                      Navigator.of(context).pop();
                    },
                    child: Text(
                      'Sign In',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const Spacer(flex: 1),
            ],
          ),
        ),
      ),
    );
  }
}
