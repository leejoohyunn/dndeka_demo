// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { classifyAppetite } = require('../services/appetiteClassifier');
const db = getFirestore();
async function classificationHandler(answers) {
  try {
    const appetiteType = await classifyAppetite(answers);
    
    await db.collection('classifications').add({
      answers,
      appetiteType,
      timestamp: FieldValue.serverTimestamp()
    });
    
    return { appetiteType };
  } catch (error) {
    console.error('Classification error:', error);
    throw new Error('분류 처리 중 오류가 발생했습니다.');
  }
}

module.exports = { classificationHandler };
// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();

// 미들웨어 설정
app.use(cors({ origin: true }));
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Server is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 안전한 핸들러 로딩
let askQuestions, classificationHandler, missionHandler, evaluationHandler;

try {
  const questionModule = require('./handlers/questionHandler');
  askQuestions = questionModule.askQuestions;
} catch (err) {
  console.error('questionHandler load error:', err);
  askQuestions = () => []; // 기본값
}

try {
  const classificationModule = require('./handlers/classificationHandler');
  classificationHandler = classificationModule.classificationHandler;
} catch (err) {
  console.error('classificationHandler load error:', err);
  classificationHandler = async () => ({ appetiteType: 'physical' }); // 기본값
}

try {
  const missionModule = require('./handlers/missionHandler');
  missionHandler = missionModule.missionHandler;
} catch (err) {
  console.error('missionHandler load error:', err);
  missionHandler = () => ({ missions: [] }); // 기본값
}

try {
  const evaluationModule = require('./handlers/evaluationHandler');
  evaluationHandler = evaluationModule.evaluationHandler;
} catch (err) {
  console.error('evaluationHandler load error:', err);
  evaluationHandler = async () => ({ score: 3, feedback: 'Default response' }); // 기본값
}

// 라우트 정의
app.get('/questions', (req, res) => {
  try {
    const questions = askQuestions();
    return res.status(200).json({ questions });
  } catch (err) {
    console.error('GET /questions error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/classify', async (req, res) => {
  try {
    const answers = req.body;
    const result = await classificationHandler(answers);
    return res.status(200).json(result);
  } catch (err) {
    console.error('POST /classify error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/missions', (req, res) => {
  try {
    const { appetiteType, socialContext = 'alone' } = req.query;
    if (!appetiteType) {
      return res.status(400).json({ error: 'appetiteType 파라미터가 필요합니다.' });
    }
    const result = missionHandler(appetiteType, socialContext);
    return res.status(200).json(result);
  } catch (err) {
    console.error('GET /missions error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/evaluate', async (req, res) => {
  try {
    const { missionId, userContent } = req.body;
    if (!missionId || !userContent) {
      return res.status(400).json({ error: 'missionId와 userContent가 필요합니다.' });
    }
    const result = await evaluationHandler(missionId, userContent);
    return res.status(200).json(result);
  } catch (err) {
    console.error('POST /evaluate error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 글로벌 오류 핸들러
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Firebase 함수로 익스포트
exports.api = functions.https.onRequest(app);