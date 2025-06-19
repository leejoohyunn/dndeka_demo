// src/data/questions.js

module.exports = [
  {
    id: 'startTime',
    question: '지금 느끼는 배고픔/식욕이 언제부터 시작되었나요?',
    type: 'text',
    hint: '점진적/갑작스러운 발생 여부를 서술해주세요.'
  },
  {
    id: 'specificFood',
    question: '특정 음식이 당기나요, 아니면 일반적인 배고픔인가요?',
    type: 'text',
    hint: '예: 특정(초콜릿), 일반(밥·빵 등)'
  },
  {
    id: 'lastMeal',
    question: '마지막 식사는 언제 하셨나요?',
    type: 'text',
    hint: '예: 12시, 3시간 전 등'
  },
  {
    id: 'emotion',
    question: '현재 어떤 감정 상태인가요?',
    type: 'text',
    hint: '예: 스트레스, 우울, 기쁨 등'
  },
  {
    id: 'externalStimuli',
    question: '주변에 음식과 관련된 자극이 있나요?',
    type: 'text',
    hint: '예: 냄새, 광고, 사람이 먹는 모습 등'
  },
  {
    id: 'pattern',
    question: '이런 식욕을 느끼는 특정한 상황이나 시간대가 있나요?',
    type: 'text',
    hint: '예: 점심시간 직후, 밤 10시 등'
  },
  {
    id: 'cognitiveRules',
    question: '식사에 대한 특별한 생각이나 규칙이 현재 영향을 미치고 있나요?',
    type: 'text',
    hint: '예: 다이어트, 간헐적 단식 등'
  },
  {
    id: 'timeConstraint',
    question: '얼마나 시간적 여유가 있나요?',
    type: 'text',
    hint: '예: 30초, 5분, 10분 이상 등'
  },
  {
    id: 'socialContext',
    question: '주변에 누가 있나요?',
    type: 'text',
    hint: '예: 혼자, 친구, 동료 등'
  }
];
