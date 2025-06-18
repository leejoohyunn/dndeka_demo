// src/handlers/questionHandler.js

/**
 * 질문 목록을 반환합니다.
 * @returns {Array<{id: string, question: string, type: string, hint: string}>}
 */
const questions = require('../../src/data/questions');

function askQuestions() {
  return questions;
}

module.exports = { askQuestions };