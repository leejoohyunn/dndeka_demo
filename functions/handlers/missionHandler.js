// src/handlers/missionHandler.js
const mappings = require('../../src/data/mappings');
const missions = require('../../src/data/missions');
const { db } = require('../services/firestoreService');

function missionHandler(userId, appetiteType, socialContext = 'alone') {
  const missionIds = mappings[appetiteType]?.[socialContext] || [];
  const selected = missions.filter(m => missionIds.includes(m.id));

// Firestore에 미션 할당 기록
db.collection('missions').add({
  userId,
  appetiteType,
  socialContext,
  missionIds,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
}).catch(console.error);

  return { missions: selected };
}

module.exports = { missionHandler };
