// functions/services/llmService.js

const functions = require('firebase-functions');
const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

/**
 * OpenAI ChatCompletion 호출
 */
async function chat(messages, options = {}) {
  const {
    model       = 'gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens   = 500,
  } = options;

  try {
    // v4 메서드 호출 방식
    const resp = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const msg = resp.choices?.[0]?.message?.content;
    if (!msg) throw new Error('OpenAI 응답이 없습니다.');
    return msg.trim();
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw new Error(`OpenAI API 오류: ${error.message}`);
  }
}

module.exports = { chat };