// src/services/missionEvaluator.js
const { chat } = require('./llmService');
const missions = require('../../src/data/missions');

/**
 * 미션 수행 평가
 * @param {string} missionId
 * @param {string} userContent  사용자 수행 기록(텍스트/사진 설명 등)
 * @returns {Promise<{ success: boolean, feedback: string }>}
 */
async function evaluateMission(missionId, userContent) {
  const mission = missions.find(m => m.id === missionId);
  if (!mission) {
    throw new Error(`알 수 없는 미션 ID: ${missionId}`);
  }

  const steps = mission.steps.map((s,i) => `${i+1}. ${s}`).join('\n');
  const prompt = `
당신은 사용자의 행동 미션 수행 여부를 평가하는 전문가입니다.

[미션 정보]
제목: ${mission.title}
설명: ${mission.description}
단계:
${steps}

[사용자 수행 기록]
${userContent}

위 내용을 바탕으로 사용자가 미션을 “성공”했는지 “실패”했는지를 JSON 형식으로 응답해 주세요.
예시:
{"success": true, "feedback": "호흡 단계에서 집중을 잘 하셨습니다."}
  `.trim();

  const messages = [
    { role: 'system', content: '당신은 미션 평가 전문가입니다.' },
    { role: 'user',   content: prompt }
  ];
  const res = await chat(messages, { temperature: 0 });

  try {
    const result = JSON.parse(res);
    if (typeof result.success !== 'boolean' || typeof result.feedback !== 'string') {
      throw new Error();
    }
    return result;
  } catch {
    throw new Error(`미션 평가 결과 파싱 실패: ${res}`);
  }
}

module.exports = { evaluateMission };
