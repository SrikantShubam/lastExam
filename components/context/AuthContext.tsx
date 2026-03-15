"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../../lib/firebase";
import { getFirestore } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  role: "admin" | "user" | null;
  isAdmin: boolean;
  points: number;
  setPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  role: null,
  isAdmin: false,
  points: 0,
  setPoints: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);

      if (currentUser) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole((userData?.role as "admin" | "user") || "user");
            setPoints(userData?.points || 0);
          } else {
            setRole("user"); // Default role if no doc exists
            setPoints(0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole("user");
          setPoints(0);
        }
      } else {
        setRole(null);
        setPoints(0);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update points in Firestore
  const updatePoints = async (newPoints: number) => {
    if (user) {
      try {
        const db = getFirestore();
        await setDoc(
          doc(db, "users", user.uid),
          { points: newPoints },
          { merge: true }
        );
        setPoints(newPoints);
      } catch (error) {
        console.error("Error updating points:", error);
      }
    }
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, loading, role, isAdmin, points, setPoints: updatePoints }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);