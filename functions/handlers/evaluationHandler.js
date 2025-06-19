// functions/handlers/evaluationHandler.js
const admin = require('firebase-admin');
const { evaluateMission } = require('../services/missionEvaluator');
const { db } = require('../services/firestoreService');

async function evaluationHandler(userId, missionId, userContent) {
  try {
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
  } catch (error) {
    console.error('Evaluation error:', error);
    throw new Error('평가 처리 중 오류가 발생했습니다.');
  }
}

module.exports = { evaluationHandler };