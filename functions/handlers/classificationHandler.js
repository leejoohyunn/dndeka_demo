// functions/handlers/classificationHandler.js
const { classifyAppetite } = require('../services/appetiteClassifier');
const { db } = require('../services/firestoreService');
const admin = require('firebase-admin');

async function classificationHandler(userId, answers) {
  try {
    // 1) LLM 분류
    const appetiteType = await classifyAppetite(answers);
    
    // 2) Firestore에 저장
    await db.collection('classifications').add({
      userId,
      answers,
      appetiteType,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { appetiteType };
  } catch (error) {
    console.error('Classification error:', error);
    throw new Error('분류 처리 중 오류가 발생했습니다.');
  }
}

module.exports = { classificationHandler };