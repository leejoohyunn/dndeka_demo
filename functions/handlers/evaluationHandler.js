// src/handlers/evaluationHandler.js
const { evaluateMission } = require('../services/missionEvaluator');
const { db }            = require('../services/firestoreService');

async function evaluationHandler(userId, missionId, userContent) {
  // 1) LLM 평가
  const { success, feedback } = await evaluateMission(missionId, userContent);

// 2) Firestore에 저장
await db.collection('evaluations').add({
  userId,
  missionId,
  userContent,
  success,
  feedback,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});

  return { success, feedback };
}

module.exports = { evaluationHandler };
 