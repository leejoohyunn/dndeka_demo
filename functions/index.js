// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.processMessage = functions.https.onCall(async (data, context) => {
  // 사용자 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "인증이 필요합니다");
  }

  const { message } = data;
  const userId = context.auth.uid;

  try {
    // 사용자 데이터 조회 (필요한 경우)
    const userDoc = await admin.firestore().doc(`users/${userId}`).get();
    const userData = userDoc.data() || {};

    // 간단한 응답 생성 로직
    let responseText = "안녕하세요! 저는 식욕 관리를 도와주는 챗봇입니다. 어떻게 도와드릴까요?";
    
    // 특정 키워드에 따른 응답
    if (message.includes("배고") || message.includes("먹고 싶")) {
      responseText = "배고픔을 느끼고 계시는군요. 지금 느끼시는 배고픔이 실제 신체적 배고픔인지, 감정적인 식욕인지 생각해보셨나요?";
    }
    
    // 사용자 경험이나 진행 상황에 따른 응답 (예시)
    if (userData.hungerType) {
      responseText += ` 이전 분석에 따르면 주로 ${userData.hungerType} 유형의 식욕을 느끼시는 것 같습니다.`;
    }
    
    return {
      success: true,
      response: responseText,
      userData: userData
    };
  } catch (error) {
    console.error("Error processing message:", error);
    throw new functions.https.HttpsError("internal", "메시지 처리 중 오류가 발생했습니다");
  }
});