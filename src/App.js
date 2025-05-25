// src/App.js 수정
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatComponent from './components/ChatComponent';
import Login from './components/Login';
import Signup from './components/Signup';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            user ? (
              <div className="app-container">
                <header className="app-header">
                  <h1>Nutrimission 챗봇</h1>
                  <button 
                    onClick={() => auth.signOut()}
                    className="logout-button"
                  >
                    로그아웃
                  </button>
                </header>
                <ChatComponent />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/signup" element={
            user ? <Navigate to="/" replace /> : <Signup />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;