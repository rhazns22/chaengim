# 📱 챙김 (Chaengim)
### **정부 혜택 탐색 & 신청 준비 개인화 PWA 서비스**

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini" />
</p>

---

> **챙김은 사용자의 기본 프로필을 바탕으로 정부 혜택을 탐색하고, 관심 혜택의 준비 서류와 마감 일정을 관리할 수 있도록 만든 모바일 우선 PWA 서비스입니다.**
> 
> **GOV24 공공데이터를 백엔드에서 동기화하고, React/Vite 프론트엔드와 Express/Prisma/MySQL 백엔드를 연결해 실제 API 기반의 혜택 조회·저장·추천 흐름을 구현했습니다.**
> 
> *⚠️ **법적 고지:** 이 서비스는 정부 신청을 대행하지 않으며 공식 대행 기관이 아닙니다. 자격 유무 판정이나 수급 보장을 의미하지 않으므로, 최종 신청 자격은 공식 기관 사이트에서 직접 확인하셔야 합니다.*

---

## 🗺️ 목차

1. [✨ 서비스 핵심 기능](#1-서비스-핵심-기능)
2. [🛠️ 기술 아키텍처 & 스택](#2-기술-아키텍처--스택)
3. [🚀 주요 보안 설계 (Security Hardening)](#3-주요-보안-설계-security-hardening)
4. [🎨 기능 및 화면 흐름](#4-기능-및-화면-흐름)
5. [📑 API 스펙 시트](#5-api-스펙-시트)
6. [💾 데이터 릴레이션십 모델 (ERD)](#6-데이터-릴레이션십-모델-erd)
7. [⚙️ 로컬 개발 환경 셋업](#7-로컬-개발-환경-셋업)
8. [🗂️ 프로젝트 디렉토리 구조](#8-프로젝트-디렉토리-구조)
9. [📈 최근 업데이트 & 릴리즈 내역](#9-최근-업데이트--릴리즈-내역)

---

## 1. ✨ 서비스 핵심 기능

*   **맞춤형 추천 필터링**: 사용자 프로필 기반 **Rule-based Scoring** 모델을 결합해 1차 추천 후보군을 산정합니다.
*   **AI 매칭 이유 제공**: 1차 선별된 후보에 대해 **Google Gemini API**를 활용하여 추천 점수, 매칭 이유, 신청 시 주의사항을 생성하여 제공합니다.
*   **공공 데이터 연동**: **정부 GOV24 Open API (v3 JSON)**를 동기화하여 실제 수집된 공공 혜택 데이터를 기반으로 작동합니다.
*   **모바일 최적화 UX**: 다이내믹 아일랜드 및 상태바와 결합되는 **Safe-Area**, 매끄러운 탭바 네비게이션, 모바일 제스처 동작을 구현했습니다.

---

## 2. 🛠️ 기술 아키텍처 & 스택

```
 ┌────────────────────────────────────────────────────────┐
 │                      Frontend Client                   │
 │       (React 19, TypeScript, Zustand, Tailwind CSS)    │
 └──────────────────────────┬─────────────────────────────┘
                            │ (HTTPS JWT / CORS)
 ┌──────────────────────────▼─────────────────────────────┐
 │                      Backend Server                    │
 │               (Express 4, TypeScript, Helmet)          │
 └──────────────────────────┬─────────────────────────────┘
                            │ (Prisma Client)
 ┌──────────────────────────▼─────────────────────────────┐
 │                       MySQL Database                   │
 │           (Users, Profiles, Benefits, SyncJobs)        │
 └────────────────────────────────────────────────────────┘
```

| 분류 | 세부 스택 기술 |
| :--- | :--- |
| **Frontend** | **React 19**, TypeScript, Vite, Vanilla CSS, Tailwind CSS, **Zustand**, Framer Motion, React Router v7 |
| **Backend** | **Node.js**, **Express 4.18**, TypeScript, **Prisma ORM**, **Helmet**, **express-rate-limit** |
| **Database** | **MySQL** |
| **AI Integration** | **Google Gemini Flash API** (Generative AI) |
| **Authentication** | **JWT (jsonwebtoken)**, **bcryptjs**, **OAuth 2.0 (Google, Kakao, Naver)** |

---

## 3. 🚀 주요 보안 설계 (Security Hardening)

> **Chaengim은 안정적인 서비스 운영을 위해 기본적인 보안 하드닝(Security Hardening)을 적용하였습니다.**

*   **시크릿 & 환경변수 분리 관리**
    *   `DATABASE_URL`, `JWT_SECRET`, `GOV24_API_KEY`, `GEMINI_API_KEY` 등 모든 민감 정보는 브라우저(프론트엔드)에 노출되지 않으며 오직 백엔드 환경변수 내에서만 안전하게 관리됩니다.
    *   `JWT_SECRET`은 32자 이상인 경우에만 구동되도록 서버 부트스트랩 시 검증 로직이 작동합니다.
*   **환경별 CORS (Cross-Origin Resource Sharing) 강화**
    *   **운영(Production)**: `https://chaengim.vercel.app` 환경 및 지정된 화이트리스트 외 로컬 접속 차단.
    *   **개발(Development)**: `localhost:5173`, `localhost:3000` 로컬 프록시 허용.
    *   허용되지 않은 도메인의 브라우저 요청은 CORS 에러를 반환합니다.
*   **보안 헤더 & Helmet 적용**
    *   `helmet()` 보안 미들웨어가 주요 HTTP 응답 헤더를 설정하여 Clickjacking, MIME 스니핑 등 주요 웹 취약점 노출을 방지합니다.
*   **엔드포인트 Rate Limiting (API 요청 속도 제한)**
    *   **전역 API** (`/api/*`): 15분당 최대 300회 제한
    *   **로그인** (`/api/auth/login`): 15분당 최대 10회 제한
    *   **회원가입** (`/api/auth/register`): 1시간당 최대 10회 제한
    *   **AI 추천 재생성** (`/api/ai/recommendations`): 1분당 최대 5회 제한
*   **데이터 소유권 검증 (ID 변조 방지)**
    *   클라이언트가 전달하는 식별자를 신뢰하지 않고, JWT 토큰 파싱을 통해 확인된 `req.user.id`만을 사용해 Prisma DB 쿼리 필터를 강제 적용합니다.

---

## 4. 🎨 기능 및 화면 흐름

### 📱 챙김 유저 메인 탭
*   **홈 (`/`)**
    *   파란색 Hero 섹션과 둥근 오버레이 카드형(`rounded-t-[32px]`) 형태의 콘텐츠 시트 디자인.
    *   Rule-based 추천 카드 슬라이드 3선 노출 및 AI 가이드 배너.
*   **혜택 탐색 (`/benefits`)**
    *   카테고리 칩 선택 가로 스크롤바 제공 및 고속 키워드 검색바 필터링.
*   **신청 보드 (`/board`)**
    *   저장한 혜택의 상태별 칸반식 흐름 (`준비중 ➔ 신청완료 ➔ 대기중 ➔ 완료`).
    *   서류 준비 체크리스트 조작 및 진행 상태 실시간 Progress Bar.
*   **신청 일정 (`/schedule`)**
    *   저장 혜택 마감 D-Day 순 정렬 목록. 마감 일주일(`D-7`) 이하 항목 강조 노출.

### 🔑 단계형 UX 온보딩 & 마이페이지
*   **단계형 회원가입 UX** (`/register/name` ➔ `/register/email` ➔ `/register/verify` ➔ `/register/password` ➔ `/register/terms`)
    *   단계별 화면 전환 애니메이션.
    *   `/register/verify` 단계는 베타 단계의 이메일 형식 확인 플로우로 설계되었습니다. (추후 실제 인증 코드 발송 로직 연동 가능)
    *   모바일 환경(안드로이드/아이폰)의 키보드 활성화 시 스크롤 최적화 및 CTA 버튼 가림 방지.
*   **보안 계정 설정** (`/settings/account`)
    *   소셜 연동 계정 여부 감지 기능을 갖춘 패스워드 재설정 로직.
*   **AI 맞춤 프로필** (`/settings/profile`)
    *   출생연도, 소득수준, 가구형태, 거주지 등 추천 계산 필터.

---

## 5. 📑 API 스펙 시트

### 🔐 인증 / 계정 관련 (`/api/auth`)

| Method | Endpoint | 설명 | 인증 필요 | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| **POST** | `/register` | 가입 정보 저장 및 계정 생성 | ✗ | 1시간 10회 |
| **POST** | `/login` | 로그인 및 JWT 토큰 발급 | ✗ | 15분 10회 |
| **POST** | `/kakao` | 카카오 로그인 및 JWT 토큰 발급 | ✗ | 15분 10회 |
| **POST** | `/naver` | 네이버 로그인 및 JWT 토큰 발급 (CSRF 검증) | ✗ | 15분 10회 |
| **GET** | `/me` | JWT 세션 조회 및 권한 획득 | ✅ | - |
| **PATCH**| `/me` | 이름 수정 | ✅ | - |
| **PATCH**| `/password` | 비밀번호 변경 (현재 비밀번호 대조 검증) | ✅ | 15분 10회 |
| **DELETE**| `/me` | 탈퇴 처리 및 Cascade 하위 연관 데이터 삭제 | ✅ | - |

### 📂 혜택 / 관리 및 AI (`/api`)

| Method | Endpoint | 설명 | 인증 필요 | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| **GET** | `/benefits` | 공공 혜택 전체 목록 조회 (조건 필터링) | ✗ | 15분 300회 |
| **GET** | `/benefits/:id`| 개별 혜택 자격 상세 확인 | ✗ | 15분 300회 |
| **GET** | `/me/saved-benefits` | 관심 보드에 저장한 혜택 및 서류 상태 로드 | ✅ | 15분 300회 |
| **POST**| `/me/saved-benefits` | 신규 혜택 저장 | ✅ | 15분 300회 |
| **DELETE**| `/me/saved-benefits/:id` | 저장 해제 | ✅ | 15분 300회 |
| **PATCH**| `/me/saved-benefits/:id/status` | 혜택 처리 상태 변경 | ✅ | 15분 300회 |
| **GET** | `/me/profile` | 내 맞춤 AI 추천 프로필 메타 데이터 로드 | ✅ | 15분 300회 |
| **PUT** | `/me/profile` | AI 추천 필터 생성 및 갱신 | ✅ | 15분 300회 |
| **GET** | `/ai/recommendations` | Gemini AI 매칭 혜택 분석 사유 출력 | ✅ | 15분 300회 |
| **POST**| `/ai/recommendations/generate`| Gemini API를 통한 분석 카드 새로고침 | ✅ | 1분 5회 |

---

## 6. 💾 데이터 릴레이션십 모델 (ERD)

```
  ┌────────────────────────────────────────────────────────┐
  │                         User                           │
  │  - id: UUID (PK)                                       │
  │  - email: String (Unique)                              │
  │  - passwordHash: String? (Social User Support)         │
  │  - googleId: String? (Unique)                          │
  │  - kakaoId: String? (Unique)                           │
  │  - naverId: String? (Unique)                           │
  └──────────┬──────────────────┬─────────────────┬────────┘
             │ 1                │ 1               │ 1
             │                  │                 │
  ┌──────────▼─────────┐  ┌─────▼───────────────┐ ┌──────▼──────────────┐
  │    UserProfile     │  │ NotificationSetting │ │   AiRecommendation  │
  │  - birthYear: Int  │  │ - deadline7D: Bool  │ │ - score: Int        │
  │  - region: String  │  │ - deadline3D: Bool  │ │ - reason: String    │
  └────────────────────┘  └─────────────────────┘ └─────────────────────┘
             │ 1
  ┌──────────▼─────────┐
  │    SavedBenefit    │
  │  - id: UUID (PK)   ├───────┐ 1
  │  - status: String  │       │
  └────────────────────┘  ┌────▼──────────────┐
                          │   ChecklistItem   │
                          │ - label: String   │
                          │ - checked: Boolean│
                          └───────────────────┘
```

---

## 7. ⚙️ 로컬 개발 환경 셋업

### Prerequisites (사전 준비)
*   **Node.js v20+**
*   **MySQL Server** (가동 중이어야 합니다)
*   **Google Gemini API Key**

### 1단계. 환경 변수 세팅
프로젝트 최상위 및 백엔드 설정에 환경 파일 생성

**`backend/.env`**
```env
DATABASE_URL="mysql://ROOT_USER:PASSWORD@localhost:3306/chaengim"
JWT_SECRET="YOUR_RANDOM_LONG_STRING_OVER_32_CHARS"
GOV24_API_KEY="your-gov24-api-key"
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
CORS_ORIGINS="http://localhost:5173"
PORT=4000
```

*   운영 배포 전 공공데이터포털 인증키(`GOV24_API_KEY`)를 안전하게 재발급하고 Railway 환경변수에만 주입합니다.

**`./.env`**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 2단계. 모듈 다운로드 및 DB 초기 설정
```bash
# 1. 의존 모듈 패키지 설치
npm install
cd backend
npm install
cd ..

# 2. MySQL Prisma 스키마 업로드 및 생성
cd backend
npx prisma db push

# 3. 시드 데이터 삽입 (정부 혜택 4종 및 마감 공지)
node run-seed.js
cd ..
```

### 3단계. 디버그 서버 실행
```bash
# 터미널 A (백엔드 인프라 구동)
cd backend
npm run dev

# 터미널 B (Vite 프론트 클라이언트 구동)
npm run dev
```

*   **Frontend Client**: `http://localhost:5173`
*   **Backend Server**: `http://localhost:4000`

---

## 8. 🗂️ 프로젝트 디렉토리 구조

```
chaengim/ (Frontend Root)
├── src/
│   ├── api/            # 프론트 통신 핵심 httpClient
│   ├── app/            # SPA Router 및 최상위 컴포넌트 마운트 지점
│   ├── components/
│   │   ├── common/     # UI 뼈대 (PrimaryButton, Skeleton, EmptyState, Toast, BottomSheet)
│   │   └── layout/     # safe-area 대응 레이아웃 쉘 (MobileShell, BottomNav)
│   ├── pages/          # 챙김 핵심 기능별 뷰 (HomePage, SchedulePage, BoardPage 등)
│   ├── store/          # Zustand 전역 영속성 스토어 (useAuthStore, useBenefitStore 등)
│   ├── types/          # Strict TypeScript 명세 정의
│   └── utils/          # D-Day 계산 및 공용 에러 헬퍼
│
└── backend/            # Express TypeScript Infrastructure
    ├── src/
    │   ├── controllers/# 비즈니스 레이어 컨트롤러
    │   ├── routes/     # 라우트 매핑 모듈
    │   ├── middlewares/# authMiddleware, rateLimit, validate
    │   └── services/   # Prisma DB 트랜잭션 및 Gemini AI 연동 엔진
    └── prisma/
        └── schema.prisma# DB 테이블 구조 설계도
```

---

## 9. 📈 최근 업데이트 & 릴리즈 내역

#### **v1.3.0 - 네이버 소셜 로그인 연동 및 가입자 자동로그인 고도화 (최신)**
*   **네이버 소셜 로그인 연동 (REST OAuth 2.0):** 네이버 로그인 연동을 위해 backend 컨트롤러, 라우트 및 Prisma `naverId` 모델을 추가하고 frontend `NaverCallbackPage.tsx`를 설계하여 인가 코드 교환, CSRF `state` 검증을 완벽하게 완수했습니다.
*   **이메일 권한 거부 Fallback & 가상 이메일 마스킹:** 네이버 계정의 이메일 정보 수집 차단 시에도 회원가입이 정상 완료되도록 가상 대체 이메일(`naver_{naverId}@naver.local`) 자동 생성 로직을 도입했으며, 해당 가상 메일 탐지 시 마이페이지 및 계정 설정에서 **"네이버 로그인 연동됨"**으로 수려하게 변환하고 안전 안내 배너를 표출합니다.
*   **프리미엄 소셜 로그인 버튼 리디자인:** 네이버 공식 브랜드 컬러 `#03C75A`와 둥글기(`24px`), 네이버/카카오/구글 브랜드 공식 로고(SVG)를 버튼 정중앙에 완벽하게 정렬하여 네이티브 앱 수준의 고품격 비주얼을 구축했습니다.
*   **기존 가입자 세션 자동로그인 안정화:** 브라우저 새로고침이나 앱 재진입 시 `localStorage`에 보관된 JWT를 기반으로 백그라운드 사용자 세션 정보 복구(`fetchMe()`) 프로세스를 전격 고도화하여 로그인 정보 불일치("게스트 님" 오표기) 버그를 영구 박멸하고 세션 만료 시 로그인 창 리다이렉트를 강제했습니다.

#### **v1.2.0 - UI 레이아웃 및 혜택 일정 고도화**
*   **일정 페이지 카테고리 아이콘화**: 신청 일정 카드(`/schedule`) 내부에 단순 마감 숫자 외에 해당 혜택이 어떠한 범주에 속하는지 한눈에 알려주는 직관적인 `BenefitIcon` 추가 및 가로폭 최적화.
*   **모바일 레이아웃 Overlap 복구**: HomePage 상단의 시원한 파란 Hero 이미지 밑으로 흰색 콘텐츠 본문 카드가 `-40px` 당겨져 올라오는 둥근 오버레이 카드형(`rounded-t-[32px] shadow`) 디자인 복구.
*   **스크롤 끝 파란색 유출 차단**: HomePage 최상단 컨테이너 배경 색상을 `bg-white`로 지정하고 bottom padding 중복 계산을 삭제하여, 모바일 디바이스에서 스크롤을 끝까지 내렸을 때 바운스(Overscroll) 영역이 파란색으로 흘러내려 깨지는 상태 개선.
*   **인증(Auth) 계열 디바이스 스퀴즈 해결**: 로그인(`LoginPage`), 회원가입 단계 뷰(`RegisterStepLayout`), 프로필 상세(`ProfileSetupPage`)의 제목과 버튼이 디바이스의 상단 바 시간/배터리 게이지 아래에 답답하게 들러붙는 현상을 `clamp(56px, calc(env(safe-area-inset-top) + 8vh), 96px)` 및 전용 safe-area 계산식 높이 배치를 적용하여 가독성 있는 모바일 스페이싱 확보 완료.
