# 📱 챙김 (Chaengim)
### **정부 혜택 탐색 & 신청 준비 개인화 PWA 서비스**

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

> **챙김은 사용자의 개인 맞춤 프로필을 바탕으로 나에게 최적화된 정부 혜택을 손쉽게 찾고, 관심 혜택의 필수 서류 및 마감 일정을 스마트하게 관리해 주는 모바일 우선 PWA(Progressive Web App) 서비스입니다.**
>
> **정부 GOV24 공공데이터 동기화 엔진을 백엔드에 탑재하고, React 19 프론트엔드와 Express/Prisma/MySQL 백엔드를 연동하여 실시간 데이터 기반의 조회·추천·칸반 보드 프로세스를 구현했습니다.**
>
> ⚠️ **법적 고지:** 본 서비스는 공식 정부 신청 대행 기관이 아닙니다. AI 및 규칙 기반 추천 결과는 참고용이며, 최종적인 수급 여부 및 자격 조건은 공식 기관(정부24 등) 홈페이지를 통해 직접 확인하셔야 합니다.

---

## 🗺️ 목차

1. [🛠️ 기술 아키텍처 & 스택](#1-기술-아키텍처--스택)
2. [💾 데이터 릴레이션십 모델 (ERD)](#2-데이터-릴레이션십-모델-erd)
3. [📑 API 스펙 시트](#3-api-스펙-시트)
4. [🚀 주요 보안 설계 (Security Hardening)](#4-주요-보안-설계-security-hardening)
5. [✨ 서비스 핵심 기능](#5-서비스-핵심-기능)
6. [🎨 기능 및 화면 흐름](#6-기능-및-화면-흐름)
7. [⚙️ 로컬 개발 환경 셋업](#7-로컬-개발-환경-셋업)
8. [🗂️ 프로젝트 디렉토리 구조](#8-프로젝트-디렉토리-구조)
9. [📈 최근 업데이트 & 릴리즈 내역](#9-최근-업데이트--릴리즈-내역)

---

## 1. 🛠️ 기술 아키텍처 & 스택

### 🏗️ 시스템 아키텍처 다이어그램

```
┌────────────────────────────────────────────────────────┐
│                      Frontend Client                   │
│   (React 19, TypeScript, Zustand, Vite, Vanilla CSS)   │
└──────────────────────────┬─────────────────────────────┘
                           │ (HTTPS JWT / CORS / JSON)
┌──────────────────────────▼─────────────────────────────┐
│                      Backend Server                    │
│   (Express 4, TypeScript, Prisma, Helmet, Rate Limiter)│
└──────────────┬──────────────────────────┬──────────────┘
               │ (Prisma Client)          │ (Gemini Flash SDK)
┌──────────────▼─────────────┐   ┌────────▼──────────────┐
│       MySQL Database       │   │     Google Gemini     │
│  (Users, Profiles, Saved)  │   │     Flash API Engine  │
└────────────────────────────┘   └───────────────────────┘
```

### 🧰 기술 스택 상세

| 분류 | 적용 기술 | 설명 |
| :--- | :--- | :--- |
| **Frontend** | `React 19`, `TypeScript`, `Vite`, `Zustand`, `Framer Motion`, `React Router v7`, `Vanilla CSS`, `Tailwind CSS` | 모바일 퍼스트 레이아웃, 오버스크롤 개선, 상태 기반 전환 애니메이션 구현 |
| **Backend** | `Node.js`, `Express 4.18`, `TypeScript`, `Prisma ORM`, `Helmet`, `express-rate-limit`, `Resend` | RESTful API 설계, 데이터 소유권 토큰 검증, 이메일 인증 발송 처리 |
| **Database** | `MySQL` | 사용자와 혜택 메타데이터 간의 관계 관리 |
| **AI Integration** | `Google Gemini Flash API` | 유저 프로필과 매칭 점수 채점, 맞춤형 매칭 분석 사유 자동 생성 |
| **Authentication** | `JWT (jsonwebtoken)`, `bcryptjs`, `OAuth 2.0 (Kakao, Naver)` | 보안 소셜 로그인 연동, 가상 이메일 마스킹 처리 |

---

## 2. 💾 데이터 릴레이션십 모델 (ERD)

Prisma Schema를 바탕으로 설계된 데이터베이스 논리적 모델 관계도입니다.

```
  ┌────────────────────────────────────────────────────────┐         ┌────────────────────────────────────────────────────────┐
  │                         User                           │         │                        Benefit                         │
  │  - id: UUID (PK)                                       │         │  - id: UUID (PK)                                       │
  │  - email: String (Unique)                              │         │  - externalId: String? (Unique)                        │
  │  - name: String?                                       │         │  - source: String ("manual" / "gov24")                 │
  │  - passwordHash: String? (Social User Support)         │         │  - title: String                                       │
  │  - provider: String ("local" / "kakao" / "naver")      │         │  - category: String                                    │
  │  - kakaoId: String? (Unique)                           │         │  - categoryLabel: String                               │
  │  - naverId: String? (Unique)                           │         │  - agency: String                                      │
  │  - avatarUrl: String?                                  │         │  - description: String                                 │
  │  - emailVerified: Boolean                              │         │  - supportContent: String                              │
  │  - createdAt: DateTime                                 │         │  - target: String                                      │
  │  - updatedAt: DateTime                                 │         │  - documents: String                                   │
  └──────┬───────────────────┬─────────────────┬───────────┘         │  - applyMethod: String                                 │
         │ 1                 │ 1               │ 1                   │  - applyUrl: String?                                   │
         │                   │                 │                     │  - officialSiteName: String?                           │
         │                   │                 │                     │  - officialAgency: String?                             │
         │                   │                 │                     │  - region: String?                                     │
  ┌──────▼─────────────┐ ┌───▼─────────────────▼───┐                 │  - ageGroup: String?                                   │
  │    UserProfile     │ │   NotificationSetting   │                 │  - incomeCondition: String?                            │
  │  - id: UUID (PK)   │ │  - id: UUID (PK)        │                 │  - rawData: Json?                                      │
  │  - birthYear: Int  │ │  - deadline7Days: Bool  │                 │  - deadline: String?                                   │
  │  - region: String  │ │  - deadline3Days: Bool  │                 │  - iconType: String                                    │
  │  - employment: Str │ │  - deadline1Day: Bool   │                 │  - isRecommended: Bool                                 │
  │  - interests: Json │ │  - checklistRem: Bool  │                 └───────┬───────────────────────────────┬────────────────┘
  │  - incomeLvl: Str  │ │  - aiRecommend: Bool    │                         │ 1                             │ 1
  │  - household: Str  │ │  - notice: Bool         │                         │                               │
  └────────────────────┘ │  - marketing: Bool      │                         │                               │
                         │  - quietStart: String   │                         │                               │
                         │  - quietEnd: String     │                         │                               │
                         │  - pushToken: String?   │                         │                               │
                         │  - platform: String?    │                         │                               │
                         └─────────────────────────┘                         │                               │
                                                                             │                               │
  ┌────────────────────────────────────────────────────────┐                 │                               │
  │                   AiRecommendation                     │                 │                               │
  │  - id: UUID (PK)                                       │                 │                               │
  │  - userId: UUID (FK) ◄─────────────────────────────────┘                 │                               │
  │  - benefitId: UUID (FK) ◄────────────────────────────────────────────────┘                               │
  │  - score: Int                                                                                            │
  │  - reason: String                                                                                        │
  │  - matchedTags: Json                                                                                     │
  │  - caution: String                                                                                       │
  └────────────────────────────────────────────────────────┘                                                 │
                                                                                                             │
  ┌────────────────────────────────────────────────────────┐                                                 │
  │                     SavedBenefit                       │                                                 │
  │  - id: UUID (PK)                                       │                                                 │
  │  - userId: UUID (FK) ◄─────────────────────────────────┘                                                 │
  │  - benefitId: UUID (FK) ◄────────────────────────────────────────────────────────────────────────────────┘
  │  - status: String ("preparing" / "applied" / "waiting" / "completed")                                    
  └──────┬─────────────────────────────────────────────────┘
         │ 1
         │
         │ 1..*
  ┌──────▼─────────────────┐
  │     ChecklistItem      │
  │  - id: UUID (PK)       │
  │  - savedBenefitId: FK  │
  │  - label: String       │
  │  - checked: Boolean    │
  └────────────────────────┘
```

---

## 3. 📑 API 스펙 시트

### 🔐 인증 및 계정 관련 API (`/api/auth`)

| Method | Endpoint | 설명 | 인증 필요 | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| **POST** | `/register` | 회원 등록 및 기본 계정 생성 | ✗ | 1시간 최대 10회 |
| **POST** | `/login` | 이메일/비밀번호 로그인 및 JWT 토큰 발급 | ✗ | 15분 최대 10회 |
| **POST** | `/kakao` | 카카오 소셜 로그인 처리 및 토큰 발급 | ✗ | 15분 최대 10회 |
| **POST** | `/naver` | 네이버 소셜 로그인 처리 (CSRF state 검증 포함) | ✗ | 15분 최대 10회 |
| **POST** | `/send-email-verification` | 가입 대기 이메일로 인증 메일 발송 | ✗ | 60초 간격 제한 |
| **POST** | `/resend-email-verification` | 이메일 인증 메일 재발송 | ✗ | 60초 간격 제한 |
| **POST** | `/verify-email` | 인증 메일 난수(6자리) 일치성 검증 | ✗ | 최대 5회 시도 제한 |
| **GET** | `/me` | 현재 JWT 세션 확인 및 유저 정보 리턴 | ✅ | - |
| **PATCH**| `/me` | 사용자 프로필 기본 정보(이름 등) 수정 | ✅ | - |
| **PATCH**| `/password` | 비밀번호 변경 (현재 비밀번호 확인 절차 포함) | ✅ | 15분 최대 10회 |
| **DELETE**| `/me` | 회원 탈퇴 (연관 관계 DB Cascade 삭제 처리) | ✅ | - |

### 📂 혜택 관리 및 AI 추천 API (`/api`)

| Method | Endpoint | 설명 | 인증 필요 | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| **GET** | `/benefits` | 정부 혜택 전체 목록 조회 (카테고리, 거주지 등 필터) | ✗ | 15분 최대 300회 |
| **GET** | `/benefits/:id`| 단일 혜택 세부 상세 정보 및 조건 확인 | ✗ | 15분 최대 300회 |
| **GET** | `/me/saved-benefits` | 로그인 유저가 북마크한 혜택 목록 로드 | ✅ | 15분 최대 300회 |
| **POST**| `/me/saved-benefits` | 관심 혜택 신규 저장 (준비중 상태로 디폴트 추가) | ✅ | 15분 최대 300회 |
| **DELETE**| `/me/saved-benefits/:id` | 관심 혜택 목록에서 삭제 (체크리스트 자동 삭제) | ✅ | 15분 최대 300회 |
| **PATCH**| `/me/saved-benefits/:id/status` | 관심 혜택 처리 상태 변경 (`preparing` ➔ `applied` 등) | ✅ | 15분 최대 300회 |
| **PATCH**| `/me/saved-benefits/:id/checklist` | 해당 혜택의 개별 준비서류 체크 상태 일괄 갱신 | ✅ | 15분 최대 300회 |
| **GET** | `/me/profile` | 내 맞춤 정보 분석 메타데이터 로드 | ✅ | 15분 최대 300회 |
| **PUT** | `/me/profile` | 맞춤 혜택 알고리즘용 유저 프로필 입력 및 업데이트 | ✅ | 15분 최대 300회 |
| **GET** | `/ai/recommendations` | Gemini AI 기반으로 계산된 맞춤 혜택 사유 로드 | ✅ | 15분 최대 300회 |
| **POST**| `/ai/recommendations` | Gemini API 분석을 통한 맞춤형 점수/사유 재생성 | ✅ | 1분 최대 5회 |

### 🔔 알림 설정 및 공지사항 API (`/api`)

| Method | Endpoint | 설명 | 인증 필요 | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| **GET** | `/me/notification-settings` | 마감 기한 알림 설정 현황 로드 | ✅ | 15분 최대 300회 |
| **PUT** | `/me/notification-settings` | 마감 및 혜택 알림 활성화/비활성화 일괄 업데이트 | ✅ | 15분 최대 300회 |
| **PATCH**| `/me/notification-settings` | 알림 및 방해금지 시간 설정 부분 업데이트 | ✅ | 15분 최대 300회 |
| **DELETE**| `/me/notification-settings/token` | 푸시 알림 디바이스 토큰 삭제 (라우트 1) | ✅ | - |
| **DELETE**| `/me/notification-token` | 푸시 알림 디바이스 토큰 해제 (라우트 2) | ✅ | - |
| **GET** | `/notices` | 공지사항 전체 목록 조회 | ✗ | 15분 최대 300회 |
| **GET** | `/notices/:id` | 특정 공지사항의 상세 본문 로드 | ✗ | 15분 최대 300회 |

---

## 4. 🚀 주요 보안 설계 (Security Hardening)

> **챙김(Chaengim)은 안정적이고 신뢰할 수 있는 사용자 정보 보호를 위해 프론트엔드와 백엔드 계층 전체에 강력한 보안 설계를 적용했습니다.**

*   **환경 변수 철저 분리 관리**
    *   `DATABASE_URL`, `JWT_SECRET`, `GOV24_API_KEY`, `GEMINI_API_KEY` 등 모든 서비스의 비밀정보는 클라이언트 번들에 일절 포함되지 않으며 오직 백엔드 실행 환경 내에서만 안전하게 조회됩니다.
    *   `JWT_SECRET`은 서버 기동 시 최소 32자 이상 길이 규격을 미충족할 경우 서버 프로세스가 구동되지 않고 종료(Bootstrap Level Block)됩니다.
*   **환경별 CORS (Cross-Origin Resource Sharing) 강화**
    *   **운영(Production)**: `https://chaengim.vercel.app` 환경 및 지정된 API 화이트리스트 도메인 외 로컬 포트나 외부 악성 도메인의 접근을 차단합니다.
    *   **개발(Development)**: `localhost:5173`, `localhost:3000` 로컬 프록시 요청에 한해 안전하게 허용합니다.
*   **보안 HTTP 헤더 Helmet 설정**
    *   `helmet()` 보안 미들웨어가 HTTP 헤더에 CSP, XSS 보호, Clickjacking 방지, MIME Sniffing 방지 등을 자동 설정합니다.
*   **요청 속도 제한 (Rate Limiting) 미들웨어 세분화**
    *   비밀번호 무작위 대입 방지 및 AI API 무제한 호출 남용을 막기 위해 기능별 IP 속도 제한을 실질적으로 나누어 배치했습니다.
*   **데이터 소유권 엄격 검증**
    *   클라이언트 단에서 요청 매개변수로 전달하는 임의의 User ID를 신뢰하지 않습니다. 백엔드에서 JWT 토큰을 직접 해독하여 획득한 `req.user.id`만을 기준으로 데이터 필터링을 강제 적용합니다.

---

## 5. ✨ 서비스 핵심 기능

*   **개인 맞춤형 점수 알고리즘 (Rule-based Scoring)**: 거주 지역, 출생 연도, 가구 형태, 소득 구간, 경제 활동 여부 등 개인 정보를 종합 분석해 적합한 혜택 추천 스코어를 산출합니다.
*   **Google Gemini AI 분석 매칭**: 점수가 높게 책정된 주요 정부 혜택에 대해 **Gemini API**를 실시간 연동하여 사용자 친화적인 매칭 이유와 필수 유의점을 자동 생성해 제공합니다.
*   **GOV24 공공데이터 동기화 인프라**: 정부24 OpenAPI를 파싱하는 스케줄러가 탑재되어 신뢰도 높은 최신 공공 혜택 자료를 제공합니다.
*   **모바일 퍼스트 UX / PWA**: PWA 설정을 지원해 앱처럼 홈 화면에 추가할 수 있으며, 다이내믹 아일랜드 및 상태 바와 간섭을 피하는 **Safe-Area 스페이싱**이 유려하게 구현되었습니다.

---

## 6. 🎨 기능 및 화면 흐름

### 📱 챙김 핵심 메인 뷰
*   **홈 (`/`)**
    *   파란색 브랜딩 Hero 섹션 및 흰색 라운디드 오버레이 시트 디자인 (`rounded-t-[32px] shadow`).
    *   나에게 어울리는 1차 선별 카드 슬라이드 쇼 및 AI 가이드 제공.
*   **혜택 탐색 (`/benefits`)**
    *   카테고리 분류 칩의 매끄러운 가로 스크롤 및 지능형 혜택 키워드 통합 검색.
*   **신청 보드 (`/board`)**
    *   칸반 보드 UI (`준비중 ➔ 신청완료 ➔ 대기중 ➔ 완료`) 형태로 진행 상태 관리.
    *   혜택 상세 서류 체크리스트 갱신 및 실시간 전체 진행률 Progress Bar 표출.
*   **신청 일정 (`/schedule`)**
    *   소유 혜택의 마감 일자를 디데이별 정렬하여 시각화. 마감 7일 이내(`D-7`)의 위급 카드 강조 표시.

### 🔑 단계별 온보딩 & 정보 설정
*   **단계별 회원가입 UX** (`/register/name` ➔ `/register/email` ➔ `/register/verify` ➔ `/register/password` ➔ `/register/terms`)
    *   이메일 중복 검사를 수반하며, `/register/verify` 단계는 6자리 숫자 코드를 메일로 발송하여 실시간 만료/시도 횟수를 통제하는 견고한 보안 플로우로 구성되어 있습니다.
    *   가상 패드 활성화 시 모바일 스크롤 영역을 자동 압축하여 하단 액션 버튼이 가려지지 않는 네이티브 경험을 전달합니다.
*   **계정 및 보안 설정** (`/settings/account`)
    *   소셜 연동 인증과 로컬 계정을 판독하여 적절한 비밀번호 재설정 로직을 지원합니다.
*   **AI 맞춤 프로필** (`/settings/profile`)
    *   소득 분위, 가구 인원, 취업 상태, 선호 관심사 등을 선택하여 맞춤형 매칭 결과를 갱신하는 페이지입니다.

---

## 7. ⚙️ 로컬 개발 환경 셋업

### Prerequisites (사전 준비 요구사항)
*   **Node.js v20 이상**
*   **MySQL Server** (가동 상태)
*   **Google Gemini API Key** (없을 시 Fallback 로컬 데이터 동작)

### 1단계. 환경 변수 세팅

프로젝트 루트 및 백엔드 폴더 내 환경 설정 파일을 구성합니다.

**`backend/.env`**
```env
DATABASE_URL="mysql://ROOT_USER:PASSWORD@localhost:3306/chaengim"
JWT_SECRET="YOUR_RANDOM_LONG_STRING_OVER_32_CHARS"
GOV24_API_KEY="your-gov24-api-key"
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
CORS_ORIGINS="http://localhost:5173"
PORT=4000
```

**`./.env`** (루트 폴더)
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 2단계. 패키지 설치 및 데이터베이스 구축

```bash
# 1. 루트 및 백엔드 의존 모듈 전체 설치
npm install
cd backend
npm install

# 2. Prisma를 통해 MySQL 로컬 데이터베이스 스키마 생성 및 적용
npx prisma db push

# 3. 데이터베이스 초기 시드 데이터 삽입
# 방법 A: 혜택 4종 및 안내 공지사항 전체 시딩 (권장)
npx prisma db seed

# 방법 B: 정부 혜택 4종만 빠르게 시딩
node run-seed.js

cd ..
```

### 3단계. 로컬 개발 서버 기동

```bash
# 터미널 A (백엔드 Express API 구동)
cd backend
npm run dev

# 터미널 B (프론트엔드 Vite Dev Server 구동 - 루트 디렉토리에서 실행)
npm run dev
```

*   **Frontend Client**: `http://localhost:5173`
*   **Backend Server**: `http://localhost:4000`

---

## 8. 🗂️ 프로젝트 디렉토리 구조

```
chaengim/ (Frontend Root)
├── src/
│   ├── api/            # HTTP 클라이언트 인스턴스 및 백엔드 API 요청 모듈
│   ├── app/            # SPA 라우팅 설정 및 최상위 컴포넌트 구성
│   ├── assets/         # 로고, 아이콘, 정적 그래픽 소스
│   ├── components/
│   │   ├── common/     # 글로벌 재사용 UI 원자 (Button, BottomSheet, Toast, Skeleton)
│   │   └── layout/     # 모바일 디바이스 뷰포트 레이아웃 쉘 (Safe-Area 적용)
│   ├── constants/      # 지역 코드, 카테고리 식별값, 경제 활동 상태 등 전역 상수군
│   ├── data/           # 화면 구성용 하드코딩 텍스트 및 기본 정적 데이터
│   ├── hooks/          # 제스처, 포커스 제어 등의 공통 리액트 커스텀 훅
│   ├── pages/          # 챙김 기능 단위별 독립 페이지 (Home, Benefits, Board, Settings 등)
│   ├── store/          # Zustand 스토어 정의 (인증 상태, 검색 키워드 상태 보관)
│   ├── styles/         # 글로벌 스타일링 정책 및 테마 설정 코드
│   ├── types/          # 백엔드 API 응답 및 혜택 속성 타입 정의
│   └── utils/          # 디데이 타이머 연산, 에러 메시지 텍스처라이저 공통 함수
│
└── backend/            # Express Backend Server (TypeScript)
    ├── src/
    │   ├── controllers/# 비즈니스 로직 핸들링 컨트롤러 레이어
    │   ├── routes/     # URL 라우팅 경로 매핑 모듈
    │   ├── middlewares/# JWT 인증, Rate Limit 제어, 스키마 유효성 검증
    │   └── services/   # 데이터베이스 트랜잭션 및 Gemini AI 분석 연동 서비스
    └── prisma/
        ├── schema.prisma # Prisma 스키마 (데이터베이스 구조 명세서)
        ├── seed.ts       # 초기 탑재용 공지사항 및 기본 혜택 시드 코드
        └── seed.js       # 컴파일된 시드 실행 스크립트
```

---

## 9. 📈 최근 업데이트 & 릴리즈 내역

#### **v1.3.0 - 네이버 소셜 로그인 연동 및 가입자 자동로그인 고도화**
*   **네이버 소셜 로그인 연동 (REST OAuth 2.0)**: 네이버 로그인을 제공하기 위해 backend 컨트롤러, 라우트 및 Prisma `naverId` 모델을 추가하고 frontend `NaverCallbackPage.tsx`를 설계하여 인가 코드 교환 및 CSRF `state` 검증을 완료했습니다.
*   **이메일 권한 거부 Fallback & 가상 이메일 마스킹**: 네이버 계정의 이메일 정보 수집 차단 시에도 회원가입이 정상 완료되도록 가상 대체 이메일(`naver_{naverId}@naver.local`) 자동 생성 로직을 도입했으며, 해당 가상 메일 탐지 시 마이페이지 및 계정 설정에서 **"네이버 로그인 연동됨"**으로 변환하고 안전 안내 배너를 표출합니다.
*   **프리미엄 소셜 로그인 버튼 리디자인**: 네이버 공식 브랜드 컬러 `#03C75A`와 둥글기(`24px`), 네이버/카카오 브랜드 공식 로고(SVG)를 버튼 정중앙에 완벽하게 정렬하여 네이티브 앱 수준의 비주얼을 구축했습니다.
*   **기존 가입자 세션 자동로그인 안정화**: 브라우저 새로고침이나 앱 재진입 시 `localStorage`에 보관된 JWT를 기반으로 백그라운드 사용자 세션 정보 복구(`fetchMe()`) 프로세스를 고도화하여 세션 정보 불일치를 수정하고 만료 시 로그인 창 리다이렉트를 보완했습니다.

#### **v1.2.0 - UI 레이아웃 및 혜택 일정 고도화**
*   **일정 페이지 카테고리 아이콘화**: 신청 일정 카드(`/schedule`) 내부에 단순 마감 숫자 외에 해당 혜택이 어떠한 범주에 속하는지 한눈에 알려주는 직관적인 `BenefitIcon` 추가 및 가로폭 최적화.
*   **모바일 레이아웃 Overlap 복구**: HomePage 상단의 시원한 파란 Hero 이미지 밑으로 흰색 콘텐츠 본문 카드가 `-40px` 당겨져 올라오는 둥근 오버레이 카드형(`rounded-t-[32px] shadow`) 디자인 복구.
*   **스크롤 끝 파란색 유출 차단**: HomePage 최상단 컨테이너 배경 색상을 `bg-white`로 지정하고 bottom padding 중복 계산을 삭제하여, 모바일 디바이스에서 스크롤을 끝까지 내렸을 때 바운스(Overscroll) 영역이 파란색으로 흘러내려 깨지는 상태 개선.
*   **인증(Auth) 계열 디바이스 스퀴즈 해결**: 로그인(`LoginPage`), 회원가입 단계 뷰(`RegisterStepLayout`), 프로필 상세(`ProfileSetupPage`)의 제목과 버튼이 디바이스의 상단 바 시간/배터리 게이지 아래에 답답하게 들러붙는 현상을 `clamp(56px, calc(env(safe-area-inset-top) + 8vh), 96px)` 및 전용 safe-area 계산식 높이 배치를 적용하여 가독성 있는 모바일 스페이싱 확보 완료.
