import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  reload,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../config/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const loginWithGoogle = async () => {

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );

    await reload(result.user);

    setCurrentUser(auth.currentUser);

    return result;
  };


  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  const loginWithEmail = async (
    email,
    password
  ) => {

    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    await reload(result.user);

    setCurrentUser(auth.currentUser);

    return result;
  };


  // ==========================================
  // EMAIL SIGNUP
  // ==========================================

  const signupWithEmail = async (
    name,
    email,
    password
  ) => {

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    // Save name
    await updateProfile(
      result.user,
      {
        displayName: name,
      }
    );

    // Send verification email
    await sendEmailVerification(
      result.user
    );

    await reload(result.user);

    setCurrentUser(auth.currentUser);

    return result;
  };


  // ==========================================
  // RESEND VERIFICATION
  // ==========================================

  const resendVerificationEmail = async () => {

    if (!auth.currentUser) {
      throw new Error(
        "No user is currently signed in."
      );
    }

    if (auth.currentUser.emailVerified) {
      throw new Error(
        "Your email is already verified."
      );
    }

    await sendEmailVerification(
      auth.currentUser
    );
  };


  // ==========================================
  // REFRESH USER
  // ==========================================

  const refreshUser = async () => {

    if (!auth.currentUser) {
      return null;
    }

    await reload(
      auth.currentUser
    );

    setCurrentUser(
      auth.currentUser
    );

    return auth.currentUser;
  };


  // ==========================================
  // PASSWORD RESET
  // ==========================================

  const resetPassword = async (
    email
  ) => {

    return sendPasswordResetEmail(
      auth,
      email
    );
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {

    await signOut(auth);

    setCurrentUser(null);
  };


  // ==========================================
  // AUTH STATE
  // ==========================================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (user) {

            try {

              await reload(user);

              setCurrentUser(
                auth.currentUser
              );

            } catch (error) {

              console.error(
                "Failed to reload user:",
                error
              );

              setCurrentUser(user);
            }

          } else {

            setCurrentUser(null);
          }

          setLoading(false);
        }
      );

    return unsubscribe;

  }, []);


  return (
    <AuthContext.Provider
      value={{
        currentUser,

        loginWithGoogle,
        loginWithEmail,

        signupWithEmail,

        resendVerificationEmail,

        refreshUser,

        resetPassword,

        logout,

        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = () =>
  useContext(AuthContext);