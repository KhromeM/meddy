import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:meddymobile/services/auth_service.dart';

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
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(flex: 1),
              // Display your logo
              Image.asset(
                'assets/images/logo_text.png',
                width: 123,
                height: 61,
              ),
              const SizedBox(
                height: 24,
              ),
              // Display the description
              Text(
                'Get your questions answered, and get \nquickly scheduled.',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 16,
                    color: Color.fromRGBO(0, 0, 0, 0.75),
                    fontWeight: FontWeight.w400),
              ),
              const Spacer(flex: 1),
              _isLoading
                  ? CircularProgressIndicator() // Show a loading indicator
                  : GestureDetector(
                      onTap: () async {
                        // Handle Google sign-in
                        setState(() {
                          _isLoading = true; // Set loading state to true
                        });
                        try {
                          await _authService.signInWithGoogle();
                        } catch (e) {
                          if (!mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(e.toString())));
                        } finally {
                          setState(() {
                            _isLoading = false; // Set loading state to false
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
                              'assets/images/google_signin_button.png', // Replace with the path to your Google logo asset
                              height: 24,
                              width: 24,
                            ),
                            SizedBox(width: 12),
                            Text(
                              "Continue with Google",
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
              // Display the sign-up text
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text(
                    "Don't have an account? ",
                  ),
                  GestureDetector(
                    onTap: () {
                      // Handle sign-up
                    },
                    child: Text(
                      'Sign Up',
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
