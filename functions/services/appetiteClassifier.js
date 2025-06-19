// src/services/appetiteClassifier.js
const { chat } = require('./llmService');
const questions = require('../data/questions');
const appetiteTypes = require('../data/appetiteTypes');

/**
 * 분류용 프롬프트 생성
 * @param {Record<string,string>} answers
 * @returns {string}
 */
function buildClassificationPrompt(answers) {
  let p = '사용자의 답변과 식욕 유형 정의입니다.\n\n';
  p += '=== 사용자 답변 ===\n';
  questions.forEach(q => {
    p += `- ${q.question}\n  답변: ${answers[q.id] ?? '없음'}\n`;
  });
  p += '\n=== 식욕 유형 정의 ===\n';
  appetiteTypes.forEach(t => {
    p += `\n[${t.id}] ${t.name}\n정의: ${t.definition}\n핵심 판단 기준:\n`;
    t.criteria.forEach(c => { p += `  • ${c}\n`; });
    p += '주관적 예시:\n';
    t.subjectiveReports.forEach(r => { p += `  - ${r}\n`; });
  });
  p += '\n위 정보를 바탕으로, 가장 알맞은 식욕 유형 ID 하나만 응답해 주세요.';
  p += '가능한 ID: physiological, emotional, external, habitual, cognitive';
  return p;
}

/**
 * 사용자 답변으로 식욕 유형 분류
 * @param {Record<string,string>} answers
 * @returns {Promise<'physiological'|'emotional'|'external'|'habitual'|'cognitive'>}
 */
async function classifyAppetite(answers) {
  const prompt = buildClassificationPrompt(answers);
  const messages = [
    { role: 'system', content: '당신은 식욕 분류 전문가입니다.' },
    { role: 'user',   content: prompt }
  ];
  const res = await chat(messages, { temperature: 0 });
  console.log('🔥 LLM 응답:', res);

  const m = res.match(/\b(physiological|emotional|external|habitual|cognitive)\b/);
  if (!m) {
    throw new Error(`분류된 식욕 유형을 찾을 수 없습니다: ${res}`);
  }
  return m[1];
}

module.exports = { classifyAppetite };
