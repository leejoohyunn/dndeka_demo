// functions/services/firestoreService.js
const admin = require('firebase-admin');

// Admin SDK가 이미 초기화되었는지 확인
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

module.exports = { db };