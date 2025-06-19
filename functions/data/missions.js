// src/data/missions.js

module.exports = [
  // 생리적 배고픔
  {
    id: 'P1.1',
    appetiteType: 'physiological',
    context: 'alone',
    title: '초단기 배고픔 현실 점검',
    timeConstraint: '30초–1분',
    description: '깊은 호흡 후 위장 감각과 마지막 식사 경과 시간 점검하기',
    steps: [
      '깊게 숨을 들이마시고 내쉬며 내면에 집중하기',
      '위장 부위에 손을 얹고 꼬르륵 소리·공허감 확인',
      '마지막 식사 시간 계산',
      '일반 음식(밥·빵 등)에 대한 개방성 평가'
    ]
  },
  {
    id: 'P2.1',
    appetiteType: 'physiological',
    context: 'intimate',
    title: '초단기 배고픔 신호 공유',
    timeConstraint: '30초–1분',
    description: '가족·친구에게 자신의 배고픔 신호를 말로 표현하기',
    steps: [
      '“위에서 꼬르륵 소리가 나요” 등 감각 표현',
      '마지막 식사 시간 함께 확인',
      '생리적 배고픔 여부 판단 공유'
    ]
  },
  {
    id: 'P3.1',
    appetiteType: 'physiological',
    context: 'formal',
    title: '전문적 배고픔 확인',
    timeConstraint: '30초–1분',
    description: '업무 중 짧게 멈추고 에너지·위장 상태 체크하기',
    steps: [
      '손을 멈추고 위장 감각 집중',
      '배고픔을 1–5로 평가',
      '마지막 식사 시간 확인'
    ]
  },
  {
    id: 'P4.1',
    appetiteType: 'physiological',
    context: 'strangers',
    title: '사회적 상황 배고픔 확인',
    timeConstraint: '30초–1분',
    description: '사회적 압력 무관하게 진짜 배고픔인지 점검하기',
    steps: [
      '짧게 호흡하며 내면에 집중',
      '위장 감각 체크',
      '“다른 사람이 먹어서 그런 건 아닌가?” 자문'
    ]
  },

  // 정서적 식욕
  {
    id: 'E1.1',
    appetiteType: 'emotional',
    context: 'alone',
    title: '초단기 감정·식욕 구분',
    timeConstraint: '30초–1분',
    description: '감정 이름 붙이고, 배고픔 신호와 구분하기',
    steps: [
      '3번 깊은 호흡',
      '현재 감정(불안·지루함 등) 명명',
      '위장 감각과 비교'
    ]
  },
  {
    id: 'E2.1',
    appetiteType: 'emotional',
    context: 'intimate',
    title: '초단기 감정 공유 테크닉',
    timeConstraint: '30초–1분',
    description: '가족·친구에게 감정 상태를 말로 표현하기',
    steps: [
      '“지금 스트레스로 단 게 당겨요” 표현',
      '음식 대신 대화를 요청'
    ]
  },
  {
    id: 'E3.1',
    appetiteType: 'emotional',
    context: 'formal',
    title: '프로페셔널 감정 인식',
    timeConstraint: '30초–1분',
    description: '업무 중 감정 트리거 식별 후 음식 충동 차단',
    steps: [
      '잠시 멈춰 “이건 스트레스구나” 자각',
      '간식 대신 심호흡'
    ]
  },
  {
    id: 'E4.1',
    appetiteType: 'emotional',
    context: 'strangers',
    title: '사회적 상황 감정 점검',
    timeConstraint: '30초–1분',
    description: '낯선 환경에서 느끼는 감정과 식욕 구분하기',
    steps: [
      '호흡 집중',
      '“이건 불안감에서 왔구나” 자각'
    ]
  },

  // 환경적 식욕
  {
    id: 'X1.1',
    appetiteType: 'external',
    context: 'alone',
    title: '초단기 환경 유발 인식',
    timeConstraint: '30초–1분',
    description: '주변 시각·후각 자극과 식욕 연결성 점검',
    steps: [
      '주변 음식 자극 스캔',
      '“광고 보기 전엔 배고프지 않았어” 회상'
    ]
  },
  {
    id: 'X2.1',
    appetiteType: 'external',
    context: 'intimate',
    title: '공유 환경 스캔',
    timeConstraint: '30초–1분',
    description: '가족·친구와 있는 공간의 음식 자극 파악',
    steps: [
      'TV 광고·테이블 위 음식 확인',
      '“친구가 먹어서 그런 건 아닌가” 자문'
    ]
  },
  {
    id: 'X3.1',
    appetiteType: 'external',
    context: 'formal',
    title: '업무 환경 신호 인식',
    timeConstraint: '30초–1분',
    description: '책상 위 간식·자판기 위치 등 음식 유혹 파악',
    steps: [
      '음식 보이는 곳 스캔',
      '“이건 환경 영향이야” 자각'
    ]
  },
  {
    id: 'X4.1',
    appetiteType: 'external',
    context: 'strangers',
    title: '공공 환경 신호 인식',
    timeConstraint: '30초–1분',
    description: '공공장소 음식 광고·냄새와 식욕 연결성 점검',
    steps: [
      '간판·냄새 확인',
      '“진짜 배고픔이 아니다” 자각'
    ]
  },

  // 습관적 식욕
  {
    id: 'H1.1',
    appetiteType: 'habitual',
    context: 'alone',
    title: '초단기 습관 인식',
    timeConstraint: '30초–1분',
    description: '루틴 기반 식욕인지 점검하기',
    steps: [
      '“항상 이 시간에 먹지” 자각',
      '실제 배고픔과 구분'
    ]
  },
  {
    id: 'H2.1',
    appetiteType: 'habitual',
    context: 'intimate',
    title: '공유 루틴 점검',
    timeConstraint: '30초–1분',
    description: '가족·친구와 루틴 식사 타이밍 대화',
    steps: [
      '“TV 볼 때 자동으로 먹는다” 공유',
      '루틴 변경 제안'
    ]
  },
  {
    id: 'H3.1',
    appetiteType: 'habitual',
    context: 'formal',
    title: '업무 루틴 점검',
    timeConstraint: '30초–1분',
    description: '업무 중 습관적 간식 소비 패턴 파악',
    steps: [
      '“회의마다 간식이 당겨” 자각',
      '대체 활동 계획'
    ]
  },
  {
    id: 'H4.1',
    appetiteType: 'habitual',
    context: 'strangers',
    title: '사회적 루틴 인식',
    timeConstraint: '30초–1분',
    description: '낯선 환경에서 자동화된 식사 패턴 파악',
    steps: [
      '“처음 보는 카페라도 메뉴가 생각난다” 자각',
      '대체 계획'
    ]
  },

  // 인지적 식욕
  {
    id: 'C1.1',
    appetiteType: 'cognitive',
    context: 'alone',
    title: '초단기 인지 평가',
    timeConstraint: '30초–1분',
    description: '식욕 충동의 근원(생리 vs 인지) 구분',
    steps: [
      '“지금 피자 생각은 실제 배고픔인가?” 자문',
      '자동적 사고 확인'
    ]
  },
  {
    id: 'C2.1',
    appetiteType: 'cognitive',
    context: 'intimate',
    title: '공유 인지 점검',
    timeConstraint: '30초–1분',
    description: '가족·친구와 인지적 식욕 차이 대화',
    steps: [
      '“이건 생각 때문이야” 공유',
      '대안 사고 제안'
    ]
  },
  {
    id: 'C3.1',
    appetiteType: 'cognitive',
    context: 'formal',
    title: '업무 인지 확인',
    timeConstraint: '30초–1분',
    description: '직장/학교에서 자동적 식욕 사고 자각',
    steps: [
      '“회의=간식” 패턴 인식',
      '대체 사고 활성화'
    ]
  },
  {
    id: 'C4.1',
    appetiteType: 'cognitive',
    context: 'strangers',
    title: '사회적 인지 평가',
    timeConstraint: '30초–1분',
    description: '낯선 환경에서 인지적 식욕 사고 파악',
    steps: [
      '“남들이 먹으니 나도” 자각',
      '자기 확언'
    ]
  }
];
