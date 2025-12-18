import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  reload,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "../utilitis/axiosConfig";

const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = async (profile) => {
    await updateProfile(auth.currentUser, {
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    });

    await reload(auth.currentUser);
    return auth.currentUser;
  };

  // Save or update user in MongoDB whenever Firebase user changes
  const saveUserToDB = async (firebaseUser) => {
    if (!firebaseUser?.email) return;

    try {
      await axios.post("http://localhost:3000/save-user", {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Unknown",
        email: firebaseUser.email,
        photo: firebaseUser.photoURL || "",
      });
      console.log("User saved/updated in DB");
    } catch (err) {
      console.error("Failed to save user to DB:", err);
    }
  };

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch role from your users collection
          const res = await axios.get(
            `http://localhost:3000/user-role/${currentUser.email}`
          );
          const userWithRole = {
            ...currentUser,
            role: res.data.role || "User", // default User
          };
          setUser(userWithRole);
        } catch (err) {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    logOut,
    googleSignIn,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
