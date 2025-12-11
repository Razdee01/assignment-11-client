import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { GoogleAuthProvider } from 'firebase/auth';


const AuthProviders = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();
    const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
    const signInUser = (email, password) => {
        setLoading(true);
        return auth.signInWithEmailAndPassword(email, password);
    }
    const logOut = () => {
      setLoading(true);
      return signOut(auth);
    };
    const googleSignIn = () => {
      setLoading(true);
      return signInWithPopup(googleProvider);
    }
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);
    const updateUserProfile = (profile) => {
      return updateProfile(auth.currentUser, profile);
    }
    const authInfo = {
      user,
      loading,
      createUser,
      signInUser,
      logOut,
      googleSignIn,
      updateUserProfile,
    };
    return <AuthContext value={authInfo}>
        {children}
    </AuthContext>;
};

export default AuthProviders;