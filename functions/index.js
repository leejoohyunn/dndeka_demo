// src/handlers/classificationHandler.js
const functions = require('firebase-functions');
const admin = require('firebase-admin'); // 이 줄 추가!
admin.initializeApp();
const firestoreService = require('./services/firestoreService');
const { classifyAppetite } = require('./services/appetiteClassifier');
const { db }              = require('./services/firestoreService');
const { chat } = require('./services/llmService');

async function classificationHandler(userId, answers) {
  // 1) LLM 분류
  const appetiteType = await classifyAppetite(answers);

  // 2) Firestore에 저장
  await db.collection('classifications').add({
    userId,
    answers,
    appetiteType,
    timestamp: admin.firestore.FieldValue.serverTimestamp() // 이제 작동함
  });

  return { appetiteType };
}

module.exports = { classificationHandler };