// functions/services/llmService.js
const { OpenAI } = require('openai');
const functions = require('firebase-functions');

// 안전하게 API 키 가져오기
let apiKey = '';
try {
  apiKey = functions.config().openai.api_key;
  if (!apiKey) {
    console.warn('⚠️ OpenAI API Key is missing in Firebase config.');
  }
} catch (err) {
  console.error('❌ Error loading OpenAI API Key from config:', err);
}

const openai = new OpenAI({
  apiKey: apiKey || '',  // 빈 값이라도 넣어서 Cloud Run crash 방지
});

module.exports = { openai };
