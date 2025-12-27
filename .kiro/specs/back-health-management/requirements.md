# Requirements Document

## Introduction

허리건강 관리 웹앱은 사용자가 일상생활에서 허리 건강을 체계적으로 관리할 수 있도록 돕는 시스템입니다. 사용자는 허리 상태를 기록하고, 운동을 추천받으며, 진행상황을 추적할 수 있습니다.

## Glossary

- **System**: 허리건강 관리 웹앱 시스템
- **User**: 허리건강을 관리하고자 하는 사용자
- **Pain_Record**: 허리 통증 정도와 관련 정보를 기록한 데이터
- **Exercise**: 허리건강 개선을 위한 운동 프로그램
- **Progress_Tracker**: 사용자의 허리건강 개선 진행상황을 추적하는 기능
- **Health_Assessment**: 사용자의 현재 허리 상태를 평가하는 기능

## Requirements

### Requirement 1: 허리 상태 기록

**User Story:** 사용자로서, 매일 허리 상태를 기록하고 싶습니다. 그래야 시간에 따른 변화를 추적할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 통증 정도를 입력하면, THE System SHALL 1-10 척도로 통증 수준을 저장한다
2. WHEN 사용자가 통증 위치를 선택하면, THE System SHALL 허리 부위별 통증 위치를 기록한다
3. WHEN 사용자가 일일 기록을 저장하면, THE System SHALL 타임스탬프와 함께 데이터를 저장한다
4. WHEN 사용자가 빈 통증 기록을 제출하려 하면, THE System SHALL 입력을 거부하고 현재 상태를 유지한다

### Requirement 2: 운동 추천

**User Story:** 사용자로서, 내 허리 상태에 맞는 운동을 추천받고 싶습니다. 그래야 효과적으로 허리건강을 개선할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자의 통증 수준이 높을 때(7-10), THE System SHALL 저강도 스트레칭 운동을 추천한다
2. WHEN 사용자의 통증 수준이 중간일 때(4-6), THE System SHALL 중강도 강화 운동을 추천한다
3. WHEN 사용자의 통증 수준이 낮을 때(1-3), THE System SHALL 고강도 예방 운동을 추천한다
4. WHEN 운동을 추천할 때, THE System SHALL 운동 설명, 소요시간, 난이도를 포함한다

### Requirement 3: 진행상황 추적

**User Story:** 사용자로서, 허리건강 개선 진행상황을 시각적으로 확인하고 싶습니다. 그래야 동기부여를 받을 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 진행상황 페이지에 접근하면, THE System SHALL 지난 30일간의 통증 변화 그래프를 표시한다
2. WHEN 사용자가 운동을 완료하면, THE System SHALL 운동 완료 기록을 저장하고 진행률을 업데이트한다
3. WHEN 통증 수준이 지속적으로 감소하면, THE System SHALL 개선 추세를 시각적으로 표시한다
4. WHEN 데이터가 충분하지 않으면, THE System SHALL 더 많은 데이터 입력을 권장하는 메시지를 표시한다

### Requirement 4: 운동 실행 및 타이머

**User Story:** 사용자로서, 추천받은 운동을 앱에서 직접 실행하고 싶습니다. 그래야 올바른 시간과 방법으로 운동할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 운동을 시작하면, THE System SHALL 운동별 타이머를 시작한다
2. WHEN 타이머가 완료되면, THE System SHALL 다음 운동으로 자동 전환하거나 완료를 알린다
3. WHEN 사용자가 운동을 일시정지하면, THE System SHALL 현재 진행상황을 저장한다
4. WHEN 운동 세션이 완료되면, THE System SHALL 완료 시간과 수행한 운동을 기록한다

### Requirement 5: 데이터 저장 및 관리

**User Story:** 사용자로서, 내 건강 데이터가 안전하게 저장되고 관리되기를 원합니다. 그래야 언제든지 내 기록을 확인할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 데이터를 입력하면, THE System SHALL 로컬 스토리지에 즉시 저장한다
2. WHEN 데이터를 저장할 때, THE System SHALL JSON 형식으로 인코딩한다
3. WHEN 앱을 재시작하면, THE System SHALL 저장된 데이터를 자동으로 로드한다
4. WHEN 데이터 손상이 감지되면, THE System SHALL 오류를 기록하고 기본값으로 복구한다

### Requirement 6: 사용자 인터페이스

**User Story:** 사용자로서, 직관적이고 사용하기 쉬운 인터페이스를 원합니다. 그래야 매일 꾸준히 사용할 수 있습니다.

#### Acceptance Criteria

1. WHEN 사용자가 앱에 접근하면, THE System SHALL 명확한 네비게이션과 주요 기능을 표시한다
2. WHEN 사용자가 폼을 작성하면, THE System SHALL 실시간 입력 검증과 피드백을 제공한다
3. WHEN 모바일 기기에서 접근하면, THE System SHALL 반응형 디자인으로 최적화된 화면을 제공한다
4. WHEN 사용자가 잘못된 입력을 하면, THE System SHALL 명확한 오류 메시지를 표시한다