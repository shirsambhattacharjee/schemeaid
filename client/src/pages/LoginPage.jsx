import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    currentUser,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    resendVerificationEmail,
    resetPassword,
  } = useAuth();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginWithEmail(
        email.trim(),
        password
      );

      if (!result.user.emailVerified) {
        setError(
          "Your email is not verified yet. Please check your inbox and verify your email."
        );
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SIGNUP
  // ==========================================

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await signupWithEmail(
        name.trim(),
        email.trim(),
        password
      );

      setSuccess(
        "Account created successfully! A verification email has been sent to your email address."
      );

      setPassword("");
    } catch (err) {
      console.error("Signup error:", err);

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await loginWithGoogle();

      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        "Please enter your email address first."
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email.trim());

      setSuccess(
        "Password reset email has been sent. Please check your inbox."
      );
    } catch (err) {
      console.error("Password reset error:", err);

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND VERIFICATION
  // ==========================================

  const handleResendVerification = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await resendVerificationEmail();

      setSuccess(
        "Verification email sent again. Please check your inbox."
      );
    } catch (err) {
      console.error(
        "Verification email error:",
        err
      );

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SWITCH LOGIN / SIGNUP
  // ==========================================

  const switchMode = (newMode) => {
    setMode(newMode);

    setError("");
    setSuccess("");

    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}

      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-container">

        {/* =====================================
            BRAND
        ====================================== */}

        <div className="auth-brand">

          <div className="auth-brand-icon">
            🌱
          </div>

          <div>
            <h1>SchemeAid</h1>

            <p>
              AI Scheme Assistant
            </p>
          </div>

        </div>

        {/* =====================================
            AUTH CARD
        ====================================== */}

        <div className="auth-card">

          {/* Header */}

          <div className="auth-card-header">

            <div className="auth-shield">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to discover government schemes made for you."
                : "Create your SchemeAid account and find eligible schemes."}
            </p>

          </div>

          {/* =====================================
              LOGIN / SIGNUP TABS
          ====================================== */}

          <div className="auth-tabs">

            <button
              type="button"
              onClick={() => switchMode("login")}
              className={
                mode === "login"
                  ? "auth-tab active"
                  : "auth-tab"
              }
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={
                mode === "signup"
                  ? "auth-tab active"
                  : "auth-tab"
              }
            >
              Sign Up
            </button>

          </div>

          {/* =====================================
              ERROR MESSAGE
          ====================================== */}

          {error && (
            <div className="auth-message error">

              <AlertCircle className="w-4 h-4 shrink-0" />

              <span>
                {error}
              </span>

            </div>
          )}

          {/* =====================================
              SUCCESS MESSAGE
          ====================================== */}

          {success && (
            <div className="auth-message success">

              <CheckCircle2 className="w-4 h-4 shrink-0" />

              <span>
                {success}
              </span>

            </div>
          )}

          {/* =====================================
              FORM
          ====================================== */}

          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : handleSignup
            }
            className="auth-form"
          >

            {/* =================================
                NAME
            ================================== */}

            {mode === "signup" && (
              <div className="auth-field">

                <label>
                  Full Name
                </label>

                <div className="auth-input-wrapper">

                  <User className="auth-input-icon" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />

                </div>

              </div>
            )}

            {/* =================================
                EMAIL
            ================================== */}

            <div className="auth-field">

              <label>
                Email Address
              </label>

              <div className="auth-input-wrapper">

                <Mail className="auth-input-icon" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />

              </div>

            </div>

            {/* =================================
                PASSWORD
            ================================== */}

            <div className="auth-field">

              <div className="auth-label-row">

                <label>
                  Password
                </label>

                {mode === "login" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="auth-forgot"
                  >
                    Forgot password?
                  </button>
                )}

              </div>

              <div className="auth-input-wrapper">

                <Lock className="auth-input-icon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  className="auth-password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

            {/* =================================
                SUBMIT BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >

              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  {mode === "login"
                    ? "Sign In"
                    : "Create Account"}

                  <ArrowRight className="w-4 h-4" />
                </>
              )}

            </button>

          </form>

          {/* =====================================
              DIVIDER
          ====================================== */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* =====================================
              GOOGLE LOGIN
          ====================================== */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="auth-google"
          >
            
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ minWidth: '18px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>

            Continue with Google

          </button>

          {/* =====================================
              EMAIL VERIFICATION
          ====================================== */}

          {currentUser &&
            !currentUser.emailVerified && (
              <div className="auth-verification">

                <div>
                  Your email is not verified.
                </div>

                <button
                  type="button"
                  onClick={
                    handleResendVerification
                  }
                  disabled={loading}
                >
                  Resend verification email
                </button>

              </div>
            )}

          {/* =====================================
              FOOTER
          ====================================== */}

          <p className="auth-footer">

            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                switchMode(
                  mode === "login"
                    ? "signup"
                    : "login"
                )
              }
            >
              {mode === "login"
                ? "Create one"
                : "Sign in"}
            </button>

          </p>

        </div>

        {/* Bottom text */}

        <p className="auth-bottom-text">
          Secure authentication powered by Firebase
        </p>

      </div>

    </div>
  );
};


// =====================================================
// FIREBASE ERROR HANDLER
// =====================================================

const getFirebaseErrorMessage = (error) => {

  switch (error?.code) {

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-not-found":
      return "No account exists with this email.";

    case "auth/wrong-password":
      return "Incorrect email or password.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/requires-recent-login":
      return "Please sign in again and try this action.";

    default:
      return (
        error?.message ||
        "Something went wrong. Please try again."
      );
  }
};

export default LoginPage;