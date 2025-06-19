// functions/handlers/missionHandler.js
const admin = require('firebase-admin');
const mappings = require('../data/mappings');
const missions = require('../data/missions');
const { db } = require('../services/firestoreService');

function missionHandler(userId, appetiteType, socialContext = 'alone') {
  try {
    const missionIds = mappings[appetiteType]?.[socialContext] || [];
    const selected = missions.filter(m => missionIds.includes(m.id));

    // Firestore에 미션 할당 기록 (async 작업이므로 catch로 처리)
    db.collection('missions').add({
      userId,
      appetiteType,
      socialContext,
      missionIds,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    }).catch(console.error);

    return { missions: selected };
  } catch (error) {
    console.error('Mission handler error:', error);
    throw new Error('미션 처리 중 오류가 발생했습니다.');
  }
}

module.exports = { missionHandler };