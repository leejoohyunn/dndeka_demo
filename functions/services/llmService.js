// functions/services/llmService.js - 수정된 버전

const functions = require('firebase-functions');
const { OpenAI } = require('openai');

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key,
});

/**
 * OpenAI ChatCompletion 호출
 */
async function chat(messages, options = {}) {
  const {
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens = 500,
  } = options;

  try {
    // API 키 확인
    if (!openai.apiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.');
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 응답이 없습니다.');
    }
    
    return content.trim();
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    
    // 더 구체적인 에러 처리
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API 할당량이 초과되었습니다.');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('유효하지 않은 OpenAI API 키입니다.');
    } else if (error.code === 'rate_limit_exceeded') {
      throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    }
    
    throw new Error(`OpenAI API 오류: ${error.message}`);
  }
}

module.exports = { chat };