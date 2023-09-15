import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../config/firebase";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("context: user: " + currentUser);
      if (currentUser) {
        console.log("logged in");
        setUser(currentUser);
      } else {
        console.log("not logged in");
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const values = {
    user,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
