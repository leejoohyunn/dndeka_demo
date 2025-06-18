// src/services/firestoreService.js
const admin = require('firebase-admin');
const db    = admin.firestore();

// functions/index.js 에서 이미 initializeApp() 되었다면,
// 여기서는 admin.app() 을 바로 사용

module.exports = { db };
