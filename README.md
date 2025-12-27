# 허리건강 관리 웹앱

허리건강을 체계적으로 관리할 수 있는 Progressive Web App입니다.

## 주요 기능

- 📊 일일 허리 통증 수준 기록
- 🏃‍♂️ 통증 수준별 맞춤 운동 추천
- 📈 진행상황 시각화 및 추적
- ⏱️ 운동 타이머 및 세션 관리
- 💾 로컬 데이터 저장 (오프라인 지원)
- 📱 PWA 기능 (설치 가능, 오프라인 작동)

## 기술 스택

- **Frontend**: TypeScript, HTML5, CSS3
- **Build Tool**: Vite
- **Testing**: Vitest, fast-check (Property-Based Testing)
- **Charts**: Chart.js
- **PWA**: Vite PWA Plugin, Service Worker
- **Storage**: Local Storage API

## 개발 환경 설정

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프리뷰 (빌드된 앱 확인)
npm run preview

# 테스트 실행
npm run test

# 속성 기반 테스트 실행
npm run test:pbt

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

## 프로젝트 구조

```
src/
├── types/           # TypeScript 타입 정의
├── interfaces/      # 인터페이스 정의
├── services/        # 비즈니스 로직 서비스
├── components/      # UI 컴포넌트
├── utils/           # 유틸리티 함수
├── styles/          # CSS 스타일
├── test/            # 테스트 설정 및 유틸리티
└── main.ts          # 앱 진입점
```

## PWA 기능

이 앱은 Progressive Web App으로 다음 기능을 제공합니다:

- **오프라인 지원**: 인터넷 연결 없이도 기본 기능 사용 가능
- **설치 가능**: 홈 화면에 앱 아이콘 추가 가능
- **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험
- **빠른 로딩**: 서비스 워커를 통한 리소스 캐싱

## 테스팅 전략

### 단위 테스트
- 특정 기능의 정확한 동작 검증
- 엣지 케이스 및 오류 조건 테스트

### 속성 기반 테스트 (Property-Based Testing)
- fast-check 라이브러리 사용
- 다양한 입력에 대한 범용적 속성 검증
- 최소 100회 반복 테스트로 신뢰성 확보

## 데이터 저장

모든 사용자 데이터는 브라우저의 Local Storage에 저장되어:
- 개인정보 보호 보장
- 오프라인 접근 가능
- 서버 의존성 없음

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request