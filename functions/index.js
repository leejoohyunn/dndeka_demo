// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const app = express();

// 미들웨어 설정
app.use(cors({ 
  origin: true,
  credentials: true 
}));
app.use(express.json());

// 데이터 파일들 로드
const questions = require('./data/questions');
const { classifyAppetite } = require('./services/appetiteClassifier');

// 기본 라우트
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Server is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 챗봇 메시지 처리 함수
const processMessage = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }

  const { message, userId, messageId } = data;
  
  try {
    console.log(`Processing message for user ${userId}: ${message}`);
    
    // 사용자 상태 확인
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    let userData = userDoc.exists() ? userDoc.data() : {};
    
    // 사용자 설문 진행 상태 초기화
    if (!userData.questionnaire) {
      userData.questionnaire = {
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: false
      };
    }

    let botResponse;
    
    // 설문이 완료되지 않은 경우
    if (!userData.questionnaire.isCompleted) {
      const currentIndex = userData.questionnaire.currentQuestionIndex;
      
      // 첫 번째 메시지인 경우 (사용자가 막 가입했거나 처음 대화하는 경우)
      if (currentIndex === 0 && Object.keys(userData.questionnaire.answers).length === 0) {
        botResponse = `안녕하세요! 🍽️ Nutrimission 챗봇입니다.
        
당신의 식욕 유형을 파악하여 맞춤형 미션을 제공해드리겠습니다.
몇 가지 질문에 답해주시면 됩니다.

첫 번째 질문입니다:
${questions[0].question}

${questions[0].hint}`;
        
        // 사용자 상태 업데이트
        await userDocRef.set({
          ...userData,
          questionnaire: {
            currentQuestionIndex: 0,
            answers: {},
            isCompleted: false
          }
        }, { merge: true });
        
      } else {
        // 이전 질문의 답변 저장
        const prevQuestionId = questions[currentIndex].id;
        userData.questionnaire.answers[prevQuestionId] = message;
        
        // 다음 질문으로 이동
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < questions.length) {
          // 다음 질문이 있는 경우
          botResponse = `답변 감사합니다! 😊

다음 질문입니다 (${nextIndex + 1}/${questions.length}):
${questions[nextIndex].question}

${questions[nextIndex].hint}`;
          
          userData.questionnaire.currentQuestionIndex = nextIndex;
          
        } else {
          // 모든 질문이 끝난 경우
          userData.questionnaire.isCompleted = true;
          
          try {
            // 식욕 유형 분류
            const appetiteType = await classifyAppetite(userData.questionnaire.answers);
            userData.appetiteType = appetiteType;
            
            // 미션 가져오기
            const missionResult = missionHandler(userId, appetiteType, 'alone');
            userData.currentMissions = missionResult.missions;
            
            botResponse = `모든 질문에 답해주셔서 감사합니다! 🎉

분석 결과, 당신의 식욕 유형은 **${getAppetiteTypeName(appetiteType)}**입니다.

이제 당신에게 맞는 미션을 제공해드리겠습니다:

**${missionResult.missions[0]?.title}**
${missionResult.missions[0]?.description}

미션 단계:
${missionResult.missions[0]?.steps?.map((step, i) => `${i + 1}. ${step}`).join('\n')}

이 미션을 수행한 후 결과를 사진이나 텍스트로 공유해주세요! 📸`;
            
          } catch (error) {
            console.error('Classification error:', error);
            botResponse = `분석 중 오류가 발생했습니다. 😔 다시 시도해주세요.`;
          }
        }
        
        // 사용자 상태 업데이트
        await userDocRef.set(userData, { merge: true });
      }
      
    } else {
      // 설문이 완료된 후의 일반 대화
      if (message.includes('미션') || message.includes('새로운')) {
        // 새 미션 요청
        if (userData.currentMissions && userData.currentMissions.length > 0) {
          const mission = userData.currentMissions[0];
          botResponse = `현재 미션을 다시 안내해드릴게요! 💪

**${mission.title}**
${mission.description}

미션 단계:
${mission.steps?.map((step, i) => `${i + 1}. ${step}`).join('\n')}

수행 시간: ${mission.timeConstraint}`;
        }
      } else {
        // 일반적인 응답
        botResponse = `미션 수행 기록을 공유해주셔서 감사합니다! 😊

계속해서 건강한 식습관을 유지해보세요. 
새로운 미션이 필요하시면 "새로운 미션"이라고 말씀해주세요!`;
      }
    }

    // 봇 응답 저장
    await db.collection('userMessages').add({
      text: botResponse,
      sender: 'bot',
      userId: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      response: botResponse
    };

  } catch (error) {
    console.error('Error processing message:', error);
    
    // 오류 발생 시 사용자에게 알리기
    await db.collection('userMessages').add({
      text: '죄송합니다. 처리 중 오류가 발생했습니다. 다시 시도해주세요. 😔',
      sender: 'bot',
      userId: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      error: true
    });
    
    throw new functions.https.HttpsError('internal', '메시지 처리 중 오류가 발생했습니다.');
  }
});

// 식욕 유형 이름 반환 함수
function getAppetiteTypeName(type) {
  const names = {
    'physiological': '생리적 배고픔',
    'emotional': '정서적 식욕',
    'external': '환경적 식욕',
    'habitual': '습관적 식욕',
    'cognitive': '인지적 식욕'
  };
  return names[type] || type;
}

// 처음 로그인한 사용자에게 자동으로 첫 질문 보내기
const initializeNewUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }

  const { userId } = data;
  
  try {
    // 이미 초기화된 사용자인지 확인
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data() || {};
    
    // 이미 설문을 시작했다면 초기화하지 않음
    if (userData.questionnaire?.isCompleted || userData.questionnaire?.currentQuestionIndex > 0) {
      return { alreadyInitialized: true };
    }

    // 첫 번째 질문을 자동으로 보냄
    const welcomeMessage = `안녕하세요! 🍽️ Nutrimission 챗봇입니다.

당신의 식욕 유형을 파악하여 맞춤형 미션을 제공해드리겠습니다.
몇 가지 질문에 답해주시면 됩니다.

첫 번째 질문입니다:
${questions[0].question}

${questions[0].hint}`;

    // 환영 메시지 저장
    await db.collection('userMessages').add({
      text: welcomeMessage,
      sender: 'bot',
      userId: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // 사용자 상태 초기화
    await db.collection('users').doc(userId).set({
      questionnaire: {
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: false
      }
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error initializing user:', error);
    throw new functions.https.HttpsError('internal', '사용자 초기화 중 오류가 발생했습니다.');
  }
});

// 안전한 핸들러 로딩
let missionHandler;
try {
  const missionModule = require('./handlers/missionHandler');
  missionHandler = missionModule.missionHandler;
} catch (err) {
  console.error('missionHandler load error:', err);
  missionHandler = () => ({ missions: [] }); // 기본값
}

// Express 라우트들 (기존 코드 유지)
// ... 기존 라우트들 ...

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
exports.processMessage = processMessage;
exports.initializeNewUser = initializeNewUser;