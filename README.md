# 📱 챙김 (Chaengim)
### **사용자 맞춤형 정부 혜택 탐색 및 일정·서류 관리 PWA 서비스**

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express_4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 4" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Zustand-orange?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini" />
</p>

---

> **챙김(Chaengim)**은 복잡한 정부 혜택을 사용자의 나이, 거주 지역, 가구 형태, 소득 수준, 취업 상태 등 개인화된 프로필 데이터를 바탕으로 자동 분석하고 맞춤형 혜택과 점수를 제공하는 **모바일 퍼스트 PWA(Progressive Web App)** 서비스입니다.
> 
> 관심 있는 혜택의 준비 서류를 칸반 보드 형태로 상태 관리하고, 마감 일정을 디데이별로 모니터링하여 중요한 혜택을 놓치지 않도록 관리합니다. **Google Gemini Flash API**를 연동하여 맞춤형 매칭 보고서를 실시간 생성하고, 백엔드는 **Express/Prisma/MySQL** 구조의 강력하고 안전한 보안 인프라를 바탕으로 구성되었습니다.

> [!WARNING]  
> **법적 고지:** 본 서비스는 공식 정부 신청 대행 기관이 아닙니다. AI 및 규칙 기반 추천 결과는 참고용이며, 최종적인 수급 여부 및 자격 조건은 공식 기관(정부24 등) 홈페이지를 통해 직접 확인하셔야 합니다.

---

## 🗺️ 목차
1. [🏗️ 기술 아키텍처 & 테크 스택](#1-기술-아키텍처--테크-스택)
2. [💾 데이터베이스 모델 및 관계도 (ERD)](#2-데이터베이스-모델-및-관계도-erd)
3. [🛡️ 보안 설계 및 데이터 가드레일 (Security Hardening)](#3-보안-설계-및-데이터-가드레일-security-hardening)
4. [🔌 API 규격서 (API Specifications)](#4-api-규격서-api-specifications)
5. [✨ 서비스 핵심 비즈니스 로직](#5-서비스-핵심-비즈니스-로직)
6. [🎨 UI 디자인 및 어플리케이션 흐름](#6-ui-디자인-및-어플리케이션-흐름)
7. [⚙️ 로컬 개발 환경 설정 (Local Setup)](#7-로컬-개발-환경-설정-local-setup)
8. [🗂️ 프로젝트 디렉토리 구조](#8-프로젝트-디렉토리-구조)
9. [📈 최근 업데이트 & 릴리즈 이력](#9-최근-업데이트--릴리즈-이력)

---

## 1. 🏗️ 기술 아키텍처 & 테크 스택

### 🖥️ 시스템 아키텍처 다이어그램 (System Architecture)

챙김의 서비스 아키텍처는 클라이언트 사이드의 신속하고 유려한 네이티브 앱 경험(PWA)과 서버 사이드의 높은 보안성 및 확장성을 동시에 보장하기 위해 설계되었습니다.

```mermaid
graph TD
    subgraph Client [Frontend PWA Client (Vercel)]
        App[React 19 & TypeScript App]
        State[Zustand Store]
        Motion[Framer Motion Animations]
        PWA[PWA Service Worker]
        App --> State
        App --> Motion
        App --> PWA
    end

    subgraph API [Backend API Server (Railway)]
        Server[Express 4 Server]
        Prisma[Prisma ORM Client]
        Security[Helmet, Rate Limiter, CORS]
        Auth[JWT Token & OAuth Handler]
        
        Server --> Security
        Server --> Auth
        Server --> Prisma
    end

    subgraph Infrastructure [Data Storage]
        DB[(MySQL Database)]
        Prisma -- SQL Queries / Connection Pooling --> DB
    end
    
    subgraph External [External Services Integration]
        Gemini[Google Gemini Flash API]
        Resend[Resend Email Provider]
    end

    Client -- HTTPS JWT & REST APIs --> Server
    Server -- Gemini Flash SDK --> Gemini
    Server -- Email Verification (SMTP/REST) --> Resend
```

---

### 🧰 기술 스택 상세 (Technology Stack)

| 구분 | 기술 스택 | 도입 목적 & 핵심 역할 |
| :--- | :--- | :--- |
| **Frontend** | `React 19`<br>`TypeScript`<br>`Vite`<br>`Zustand`<br>`Framer Motion`<br>`Vanilla CSS` | • 컴포넌트 단위 고속 렌더링 및 모바일 퍼스트 레이아웃<br>• Zustand를 통한 경량 전역 상태 관리 (인증 및 캐시 세션 보존)<br>• Framer Motion 기반 60fps 마이크로 애니메이션 및 상태 전환 구현<br>• PWA 사양을 통한 오버스크롤 터치 방지 및 모바일 하단 가상 키보드 밀림 현상 방어 |
| **Backend** | `Node.js`<br>`Express 4.18`<br>`TypeScript`<br>`Prisma ORM` | • RESTful API 서비스 설계 및 관심사 분리(Clean Routing)<br>• Prisma ORM 모델을 매개로 안전한 Type-Safe 쿼리 빌드 및 DB 통신 속도 극대화<br>• TypeScript 기반 컴파일 타임 에러 검출로 서버 안정성 확보 |
| **Database** | `MySQL` | • 사용자 계정, 맞춤 프로필, 혜택 원본 메타데이터 및 신청서(북마크) 보드 상태의 영속적 관계 및 트랜잭션 관리 |
| **AI Engine** | `Google Gemini Flash API` | • 실시간 사용자 맞춤 정보 및 혜택 속성 연산을 통한 정밀 적합성 점수(0~100) 및 개인화 추천 가이드라인 텍스트 동적 생성 |
| **Security & Infrastructure** | `Helmet`<br>`express-rate-limit`<br>`Zod`<br>`Resend` | • HTTP 취약성 헤더 방어, 무차별 대입 및 남용 방지(Rate Limiter)<br>• Zod 기반 런타임 입출력 데이터 무결성 강제 검증<br>• Resend API 연동을 통한 비동기 이메일 6자리 임의 인증코드 처리 |

---

### 💡 주요 아키텍처 결정 사항 (Architectural Decisions)

1. **상태 관리의 분화 (Zustand & React Hooks)**
   - API 통신과 UI 계층 간의 느슨한 결합을 위해 전역 세션(인증 상태, 토큰 세션)만 Zustand 스토어에 보존하며, 폼(Form) 상태와 개별 뷰의 상태는 지역 상태로 격리하여 렌더링 부하를 극대화로 감소시켰습니다.
2. **REST API 및 데이터 소유권 검증 (Data Ownership Isolation)**
   - 백엔드는 클라이언트의 쿼리 매개변수로 수신되는 User ID 값을 절대 맹신하지 않습니다. JWT 토큰을 매 라우트 핸들러마다 검증 및 디코딩하여 추출한 `req.user.id` 값을 기반으로 DB 쿼리를 한 번 더 검증함으로써 데이터 하이재킹을 사전에 완벽히 방지합니다.
3. **PWA 오프라인 감지 및 가상 키보드 스퀴즈 문제 극복**
   - 모바일 환경에서의 화면 터치 가림을 대응하기 위해 CSS 환경 변수인 `env(safe-area-inset-top)` 및 `env(safe-area-inset-bottom)`을 최상단 레이아웃(MobileShell)에 빌트인하고, 회원가입 폼 가동 시 모바일 브라우저 뷰포트 크기를 자동 제어하도록 조치하였습니다.

---

## 2. 💾 데이터베이스 모델 및 관계도 (ERD)

챙김은 확장성을 고려하여 1:1 관계(User - UserProfile, User - NotificationSetting), 1:N 관계(User - SavedBenefit, User - AiRecommendation)를 정규화하여 관리합니다. 아래는 Prisma Schema 파일에 기반한 관계형 데이터 구조 모델링입니다.

```mermaid
erDiagram
    User {
        String id PK "UUID"
        String email UK "이메일"
        String name "이름"
        String passwordHash "패스워드 일방향 해시"
        String provider "가입처 (local / kakao / naver)"
        String googleId UK "구글 연동 ID (예비)"
        String kakaoId UK "카카오 연동 ID"
        String naverId UK "네이버 연동 ID"
        String avatarUrl "프로필 이미지 URL"
        Boolean emailVerified "이메일 인증 여부"
        DateTime createdAt "생성일자"
        DateTime updatedAt "갱신일자"
    }
    UserProfile {
        String id PK "UUID"
        String userId FK "소유주 외래키"
        Int birthYear "출생연도"
        String region "거주 행정지역"
        String employmentStatus "취업/근무상태"
        Json interests "관심 카테고리 (JSON배열)"
        String incomeLevel "소득구간"
        String householdType "가구 형태"
        DateTime createdAt
        DateTime updatedAt
    }
    Benefit {
        String id PK "UUID"
        String externalId UK "공공 OpenAPI 혜택 코드"
        String source "데이터 출처 (manual / gov24)"
        String title "정부 혜택 명칭"
        String category "분류 코드"
        String categoryLabel "분류 한글 라벨"
        String agency "제공 대행 기관"
        String description "혜택 요약 정보"
        String supportContent "상세 지원 내용"
        String target "지원 대상 조건"
        String documents "구비 서류 설명"
        String applyMethod "신청 방법"
        String applyUrl "공식 신청 외부 URL"
        String officialSiteName "공식 기관명"
        String officialAgency "집행 기관"
        String region "대상 지역 정보"
        String ageGroup "대상 연령군"
        String incomeCondition "대상 소득조건"
        Json rawData "공공데이터 전체 메타데이터"
        String deadline "신청 마감시기"
        String iconType "출력할 아이콘 식별자"
        Boolean isRecommended "주요 추천 혜택 여부"
        DateTime createdAt
        DateTime updatedAt
    }
    SavedBenefit {
        String id PK "UUID"
        String userId FK "유저 외래키"
        String benefitId FK "혜택 외래키"
        String status "신청 상태 (preparing/applied/waiting/completed)"
        DateTime createdAt
        DateTime updatedAt
    }
    ChecklistItem {
        String id PK "UUID"
        String savedBenefitId FK "북마크 혜택 외래키"
        String label "구비 서류 명칭"
        Boolean checked "준비 완료 여부"
        DateTime createdAt
        DateTime updatedAt
    }
    AiRecommendation {
        String id PK "UUID"
        String userId FK "유저 외래키"
        String benefitId FK "혜택 외래키"
        Int score "적합성 스코어 (0-100)"
        String reason "Gemini 기반 맞춤 추천 이유"
        Json matchedTags "매칭된 프로필 태그 리스트"
        String caution "신청 시 유의점"
        DateTime createdAt
    }
    NotificationSetting {
        String id PK "UUID"
        String userId FK "유저 외래키"
        Boolean deadline7Days "마감 7일전 알림"
        Boolean deadline3Days "마감 3일전 알림"
        Boolean deadline1Day "마감 1일전 알림"
        Boolean checklistReminder "미완료 서류 알림"
        Boolean aiRecommendation "AI 신규 추천 알림"
        Boolean notice "새로운 공지사항 알림"
        Boolean marketingNotice "마케팅 수신동의"
        String quietHoursStart "알림 제한 시작 시간"
        String quietHoursEnd "알림 제한 종료 시간"
        String pushToken "웹푸시 디바이스 토큰"
        String platform "브라우저 및 OS 타입"
        DateTime createdAt
        DateTime updatedAt
    }
    Notice {
        String id PK "UUID"
        String title "공지 사항 제목"
        String content "상세 안내 본문"
        String category "카테고리"
        Boolean isImportant "필독 공지 여부"
        DateTime createdAt
        DateTime updatedAt
    }
    SyncJob {
        String id PK "UUID"
        String status "배치 작업 상태 (RUNNING/SUCCESS/FAILED)"
        Int fetchedCount "수신된 행 개수"
        Int createdCount "신규 생성 개수"
        Int updatedCount "기존 데이터 업데이트 개수"
        Int failedCount "실패 개수"
        String errorMessage "에러 로그 텍스트"
        DateTime startedAt
        DateTime completedAt
    }

    User ||--o| UserProfile : "owns"
    User ||--o| NotificationSetting : "defines"
    User ||--o{ SavedBenefit : "saves"
    User ||--o{ AiRecommendation : "assigned"
    Benefit ||--o{ SavedBenefit : "referenced"
    Benefit ||--o{ AiRecommendation : "compared"
    SavedBenefit ||--o{ ChecklistItem : "contains"
```

---

## 3. 🛡️ 보안 설계 및 데이터 가드레일 (Security Hardening)

챙김은 사용자의 주요 데이터 및 개인정보를 보호하고 악의적 트래픽 공격을 차방하기 위해 다층 레이어 보안 모델을 적용했습니다.

### 📧 이메일 인증 절차 보안 및 설계 표준
*   **해시 암호화 단방향 저장**: 이메일 검증 시 사용되는 6자리 일회용 난수 코드는 데이터베이스에 평문 저장되지 않으며, **SHA-256 해시 함수**로 변환되어 저장(`emailVerificationCodeHash`)됩니다.
*   **유효 만료 시간 강제화**: 난수 코드는 발송 후 **10분**이 초과하면 백엔드 배치 엔진 및 데이터베이스에서 유효가 상실됩니다.
*   **동작 쿨다운 정책**: 인증 메일 무차별 스팸 발송 행위를 차단하기 위해 **60초 간격의 재발송 쿨다운** 타이머가 내장되어 클라이언트와 백엔드 양측에서 제한됩니다.
*   **계정 잠금 가드레일**: 메일 코드 입력 실패 횟수가 5회 연속 발생 시, 기존 난수를 폐기하고 이메일 인증 절차를 **초기 락(Lockout) 상태**로 격리하여 새로 인증 코드를 요청하게 만듭니다.

### 🖥️ API 인프라 보안
*   **Helmet 보안 헤더 바인딩**: 공통 HTTP 헤더 취약점 공격(Clickjacking, MIME-sniffing, XSS)을 방어하기 위해 Node 백엔드 부팅 단계에서 Helmet 모듈을 활성화합니다.
*   **세분화된 CORS (Cross-Origin Resource Sharing)**:
    - **운영 환경**: 허가된 클라이언트 주소(`https://chaengim.vercel.app`) 및 백엔드 관리 포트 통신 도메인만 통과시키고 그 외 익명 도메인의 비인가 API 점거를 일절 불허합니다.
    - **개발 환경**: `localhost:5173`, `localhost:3000` 로컬 프록시 포트의 크로스 통신만 한시 보장합니다.
*   **IP 기반 속도 제한 (Rate Limiting) 구성**:
    - 일반 엔드포인트: 15분당 최대 300회 요청으로 제한하여 DOS 공격 및 리소스 마스크 차단.
    - 회원가입(`POST /api/auth/register`) 및 로그인(`POST /api/auth/login`): 1시간 및 15분당 최대 10회로 제한하여 사전 대입 공격 방어.
    - AI 분석 매칭 생성(`POST /api/ai/recommendations`): 무차별적인 LLM API 비용 소모를 통제하기 위해 **1분당 최대 5회**의 극제한 정책 수립.

---

## 4. 🔌 API 규격서 (API Specifications)

모든 API 엔드포인트의 기본 프리픽스는 `/api`입니다. 

### 🔐 1. 인증 및 계정 제어 (`/api/auth`)

| Method | Endpoint | 설명 | JWT 필수 | Rate Limit |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/register` | 신규 이메일 가입 및 기본 계정 설정 | ✗ | 1시간 내 10회 |
| `POST` | `/login` | 로그인 및 세션 JWT 토큰 발급 | ✗ | 15분 내 10회 |
| `POST` | `/kakao` | 카카오 소셜 로그인 연동 및 토큰 반환 | ✗ | 15분 내 10회 |
| `POST` | `/naver` | 네이버 REST OAuth 로그인 및 CSRF state 검증 | ✗ | 15분 내 10회 |
| `POST` | `/send-email-verification` | 가입 대기 메일로 6자리 핀코드 전송 | ✗ | 60초 쿨다운 |
| `POST` | `/resend-email-verification` | 메일 재발급 | ✗ | 60초 쿨다운 |
| `POST` | `/verify-email` | 6자리 대조 및 가입자 이메일 인증 활성화 | ✗ | 최대 5회 기입 제한 |
| `GET` | `/me` | 현재 JWT 토큰 소유자의 세션 세부 정보 조회 | ✅ | - |
| `PATCH` | `/me` | 사용자 프로필 정보(이름, 아바타 등) 변경 | ✅ | - |
| `PATCH` | `/password` | 비밀번호 변경 (현재 비밀번호 검증 병행) | ✅ | 15분 내 10회 |
| `DELETE` | `/me` | 회원 탈퇴 (UserProfile, SavedBenefit 데이터 연쇄 삭제) | ✅ | - |

---

### 📂 2. 맞춤 프로필 & AI 연산 (`/api`)

| Method | Endpoint | 설명 | JWT 필수 | Rate Limit |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/me/profile` | 사용자가 저장한 맞춤 검색 필터용 정보 조회 | ✅ | 15분 내 300회 |
| `PUT` | `/me/profile` | 맞춤 혜택 필터링을 위한 프로필 저장/수정 | ✅ | 15분 내 300회 |
| `GET` | `/ai/recommendations` | Gemini AI 기반 분석이 완료된 추천 목록 반환 | ✅ | 15분 내 300회 |
| `POST` | `/ai/recommendations` | Gemini API를 호출하여 내 조건 분석 및 점수 재생성 | ✅ | 1분 내 5회 |

---

### 📋 3. 정부 혜택 및 신청서 관리 (`/api`)

| Method | Endpoint | 설명 | JWT 필수 | Rate Limit |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/benefits` | 전체 정부 혜택 리스트 조회 (지역, 카테고리 필터링) | ✗ | 15분 내 300회 |
| `GET` | `/benefits/:id` | 개별 정부 혜택의 서류, 신청 기간 등 상세 정보 조회 | ✗ | 15분 내 300회 |
| `GET` | `/me/saved-benefits` | 로그인 사용자가 칸반에 저장해둔 북마크 리스트 로드 | ✅ | 15분 내 300회 |
| `POST` | `/me/saved-benefits` | 관심 혜택 신규 등록 (최초 상태: `preparing`) | ✅ | 15분 내 300회 |
| `DELETE` | `/me/saved-benefits/:id` | 관심 혜택 해제 및 연관 체크리스트 목록 자동 삭제 | ✅ | 15분 내 300회 |
| `PATCH` | `/me/saved-benefits/:id/status` | 신청 진행 상태 변경 (`preparing` ➔ `applied` 등) | ✅ | 15분 내 300회 |
| `PATCH` | `/me/saved-benefits/:id/checklist` | 해당 혜택 서류 준비 체크리스트 항목 체크/해제 | ✅ | 15분 내 300회 |

---

### 🔔 4. 알림 구성 및 공지사항 (`/api`)

| Method | Endpoint | 설명 | JWT 필수 | Rate Limit |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/me/notification-settings` | 마감일정 7/3/1일전 알림 여부, 에티켓 시간 로드 | ✅ | 15분 내 300회 |
| `PUT` | `/me/notification-settings` | 마감 알림 수신 상태 일괄 업데이트 | ✅ | 15분 내 300회 |
| `PATCH` | `/me/notification-settings` | 알림 및 방해금지 에티켓 시간 변경 | ✅ | 15분 내 300회 |
| `DELETE` | `/me/notification-settings/token` | 웹푸시 기기 연동 토큰 삭제 | ✅ | - |
| `GET` | `/notices` | 서비스 전체 공지사항 게시판 데이터 조회 | ✗ | - |
| `GET` | `/notices/:id` | 단건 공지사항 내용 로드 | ✗ | - |

---

## 5. ✨ 서비스 핵심 비즈니스 로직

### 🧮 1단계: 규칙 기반 적합성 스코어링 (Rule-based Filtering)
*   **지역 연산**: 공공 데이터 혜택의 대상 지역 조건 필드(`region`)와 가입자 프로필 지역 정보가 교차 검증됩니다. (지자체 전용 혜택 필터링)
*   **나이 연산**: 출생연도를 토대로 현재 나이를 도출한 뒤 혜택 연령 조건 범위와 대조합니다.
*   **가구/소득 필터링**: 혜택에 명시된 가구 자격 조건 및 중위소득 기준 구간에 유저 정보가 포섭되는지 사전에 걸러내는 선행 연산을 거쳐 추천 대상을 좁힙니다.

### 🤖 2단계: Google Gemini Flash AI 연동 고도화
*   정적 필터링으로 걸러진 혜택 목록 중 가입자 특성과 가장 근접한 혜택들을 발굴하여 **Gemini Flash API**에 컨텍스트 구조를 전송합니다.
*   LLM은 다음 데이터를 실시간 가공하여 JSON 형태로 리턴합니다:
    1. **적합성 점수(0~100)**: 유저의 경제 상태와 혜택 목적의 부합도를 수치화.
    2. **추천 핵심 사유**: 왜 본인에게 유리한지 알기 쉬운 자연어로 3줄 요약.
    3. **매칭 조건 해시태그**: `#청년`, `#창업`, `#1인가구` 등의 연관 데이터.
    4. **신청 시 필수 유의점**: 누락하기 쉬운 결격 사유 및 사전 준비 팁.

---

## 6. UI 디자인 및 어플리케이션 흐름

챙김 PWA는 네이티브 환경처럼 매끄럽고 모던한 조작감을 느낄 수 있는 디자인 시스템이 반영되어 있습니다.

*   **홈 화면 (`/`)**:
    - **브랜딩 블루 히어로 레이아웃**: 페이지 진입 시 시그니처 딥 블루 배경에 마스코트 비주얼이 배치되어 프리미엄 첫인상을 선사합니다.
    - **흰색 라운드 오버레이 시트**: 아래에서 `rounded-t-[32px]` 규격의 콘텐츠 카드가 자연스럽게 스택을 밀어 올리도록 구성되었습니다.
*   **탐색 뷰 (`/benefits`)**:
    - 가로 슬라이드가 지원되는 유연한 혜택 필터 칩 구성으로 편안한 한 손 조작을 제공합니다.
*   **신청 보드 (`/board`)**:
    - `준비중 ➔ 신청완료 ➔ 대기중 ➔ 완료`까지 4단계의 스와이프 가능한 탭 바 형태의 칸반 레이아웃을 통해 진행 현황을 파악합니다.
*   **알림 및 마감 캘린더 일정 (`/schedule`)**:
    - 마감이 임박한 디데이별로 자동 정렬되어 D-7 이내의 카드는 강렬한 시각 피드백으로 경각심을 줍니다.

---

## 7. ⚙️ 로컬 개발 환경 설정 (Local Setup)

### 📋 사전 준비 사항
*   **Node.js v20 이상**
*   **MySQL Database** 가동
*   **Gemini API Key** (Google AI Studio 발급)
*   **Resend API Key** (이메일 인증코드 발송용)

---

### 1단계. 로컬 환경 변수 파일 정의

로컬 실행에 필요한 설정 파일을 프론트엔드 루트와 백엔드 경로에 각각 배치합니다.

**📁 챙김 백엔드 환경 설정 (`backend/.env`)**
```env
# MySQL DB 연결 설정
DATABASE_URL="mysql://ROOT_USER:PASSWORD@localhost:3306/chaengim"

# JWT 토큰 암호화 키 (최소 32자 이상 강력한 해시 문자열 권장)
JWT_SECRET="YOUR_RANDOM_LONG_STRING_OVER_32_CHARS"

# 이메일 발송용 Resend API 설정
RESEND_API_KEY="re_yourResendApiKey"
EMAIL_FROM="챙김 <noreply@yourdomain.app>"

# 외부 연동 AI API 설정
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# CORS 프론트엔드 포트 허용 목록
CORS_ORIGINS="http://localhost:5173"
PORT=4000
```

**📁 챙김 프론트엔드 환경 설정 (`./.env`)**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

### 2단계. 패키지 설치 및 마이그레이션 실행

```bash
# 1. 프론트엔드 루트 및 백엔드 의존성 모듈 일괄 설치
npm install
cd backend
npm install

# 2. Prisma 스키마를 통해 로컬 MySQL 테이블을 생성 및 연동
npx prisma db push

# 3. 데이터베이스 기초 공지사항 및 혜택 4종 시드 데이터 동기화
npx prisma db seed

# 상위 폴더로 복귀
cd ..
```

---

### 3단계. 개발 서버 동시 구동

```bash
# [터미널 A] 백엔드 API 서버 시작 (backend 폴더 내)
cd backend
npm run dev

# [터미널 B] 프론트엔드 Vite 개발 서버 시작 (프로젝트 루트 폴더 내)
npm run dev
```

*   **프론트엔드 로컬 주소**: `http://localhost:5173`
*   **백엔드 로컬 API 주소**: `http://localhost:4000`

---

## 8. 🗂️ 프로젝트 디렉토리 구조

```text
chaengim/ (Frontend Root)
├── src/
│   ├── api/            # Axios API 요청 클래스 및 토큰 인터셉터
│   ├── app/            # SPA 라우팅 경로 매핑 및 최상단 App 프레임
│   ├── assets/         # 브랜딩 로고, 아이콘 리소스 및 SVG 그래픽스
│   ├── components/
│   │   ├── common/     # 글로벌 단위 소형 공통 UI (Button, Input, BottomSheet, Toast, Skeleton)
│   │   └── layout/     # 모바일 디바이스 뷰포트 레이아웃 프레임 (Safe-Area 패딩 주입)
│   ├── constants/      # 거주지 코드, 맞춤 카테고리 식별키 등 전역 상수 모음
│   ├── data/           # 화면 데모 텍스트용 임시 정적 데이터
│   ├── hooks/          # 제스처, 터치 오버스크롤 방어 등 커스텀 훅 모음
│   ├── pages/          # 챙김 기능 단위별 뷰 컴포넌트 (Home, Benefits, Board, Settings 등)
│   ├── store/          # Zustand 스토어 정의 (유저 로그인 세션 및 전역 검색어 상태)
│   ├── styles/         # CSS Reset, 테마 컬러 변수 정의
│   ├── types/          # 백엔드 연동 DTO 및 혜택 필드 인터페이스 선언
│   └── utils/          # D-Day 연산 및 에러 포맷팅 공통 헬퍼 함수
│
└── backend/            # Express Backend Server (TypeScript 기반)
    ├── src/
    │   ├── controllers/# 컨트롤러 레이어 (HTTP 요청 분석 및 비즈니스 로직 연계)
    │   ├── routes/     # 엔드포인트 URL 분기 처리
    │   ├── middlewares/# 인증(Auth), Zod 스키마 벨리데이터, 속도 제한 필터
    │   └── services/   # 데이터 연산 및 Gemini AI 모델 실시간 API 중개 서비스
    └── prisma/
        ├── schema.prisma # Prisma 데이터베이스 관계형 테이블 구조 정의서
        ├── seed.ts       # 초기 혜택 시딩 소스 파일
        └── seed.js       # 컴파일 완료된 자바스크립트용 시딩 실행 파일
```

---

## 9. 📈 최근 업데이트 & 릴리즈 이력

### 📌 **v1.3.0 - 네이버 소셜 로그인 연동 및 가입자 자동로그인 고도화**
*   **네이버 소셜 로그인 연동 (REST OAuth 2.0)**: 백엔드 인증 미들웨어 및 Prisma `naverId` 필드를 확장하고 프론트엔드에 `NaverCallbackPage.tsx`를 도입하여 네이버 로그인 인가 코드를 안정적으로 처리하고 CSRF 방어용 `state` 검증을 완벽 구현했습니다.
*   **이메일 권한 거부 Fallback & 마스킹 처리**: 네이버 연동 시 이메일 수집을 거부한 유저를 수용하기 위해 임의의 가상 이메일(`naver_{naverId}@naver.local`)을 대체 부여하여 정상 가입을 보장하고, 마이페이지에서는 안전 안내 배너와 함께 **"네이버 로그인 연동 완료"** 상태를 시각화합니다.
*   **소셜 로그인 전용 버튼 UX 개편**: 네이버 브랜드 가이드라인을 준수하는 공식 헥사코드 `#03C75A` 바탕의 둥근 모서리(`24px`) 버튼 디자인을 전면 도입하고 SVG 브랜드 로고를 완벽 배치했습니다.
*   **앱 재진입 시 세션 자동 복구(Auto Login)**: 브라우저 새로고침 및 모바일 PWA 재기동 시 `localStorage` 내부의 JWT 토큰 검증 API(`fetchMe()`)를 백그라운드에서 자동 처리하여 가입 세션을 끊김 없이 연결하도록 세션 라이프사이클을 개선했습니다.

### 📌 **v1.2.0 - 모바일 레이아웃 최적화 및 혜택 일정 가시성 개선**
*   **신청 일정 아이콘 시각화**: D-Day 관리 카드에 혜택 카테고리 전용 아이콘(`BenefitIcon`)을 추가로 연계하여, 텍스트를 읽지 않고도 카드의 혜택 종류를 바로 구별하도록 개선했습니다.
*   **모바일 탑/바텀 Safe-Area 간섭 해결**: 아이폰 Dynamic Island 및 모바일 하단 액션 버튼 밀림 현상을 개선하기 위해 레이아웃 컴포넌트의 safe-area 여백을 `clamp(56px, calc(env(safe-area-inset-top) + 8vh), 96px)`로 유연화하여 비주얼 품질을 높였습니다.
*   **바운스 오버스크롤 깨짐 방지**: 홈 화면의 하단 부분 스크롤을 초과 진행 시 파란색 배경 색상이 번지는 비정상 바운스를 강제 차단하고 흰색(`bg-white`) 단일 배경을 고수해 완성도 높은 마감을 구현했습니다.
