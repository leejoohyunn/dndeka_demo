// src/contexts/AuthContext.js 파일 생성
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 회원가입 함수
  async function signup(email, password, displayName) {
    try {
      // 사용자 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 사용자 프로필 데이터 저장
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        email,
        createdAt: serverTimestamp(),
        hungerType: null,
        currentMission: null,
        missionProgress: 0
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // 로그인 함수
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 로그아웃 함수
  function logout() {
    return signOut(auth);
  }

  // 사용자 인증 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...userDoc.data()
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}