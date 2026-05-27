# 챙김 (Chaengim) — 정부 혜택 탐색 & 신청 준비 관리 PWA

> 챙김은 놓치기 쉬운 정부 혜택을 탐색하고, 저장한 혜택의 신청 준비 상태와 마감 일정을 개인화하여 관리할 수 있도록 설계한 모바일 앱형 PWA입니다.
>
> **이 서비스는 정부 신청을 대행하지 않습니다.** 실제 신청 가능 여부와 최종 자격 확인은 각 공식 기관 사이트에서 진행해야 합니다. AI 추천은 입력 정보를 바탕으로 한 참고용 안내이며, 자격 판정이나 수급 보장을 의미하지 않습니다.

---

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [기술 스택](#2-기술-스택)
3. [주요 기능](#3-주요-기능)
4. [화면 구성](#4-화면-구성)
5. [API 목록](#5-api-목록)
6. [데이터 모델](#6-데이터-모델)
7. [실행 방법](#7-실행-방법)
8. [디렉토리 구조](#8-디렉토리-구조)
9. [아키텍처 & 보안](#9-아키텍처--보안)
10. [QA & 빌드 현황](#10-qa--빌드-현황)
11. [데이터 정책](#11-데이터-정책)
12. [한계 및 개선 예정](#12-한계-및-개선-예정)

---

## 1. 프로젝트 소개

**챙김(Chaengim)**은 사용자가 놓치기 쉬운 정부 혜택을 탐색하고, 저장한 혜택의 신청 준비 상태와 마감 일정을 관리할 수 있도록 설계한 모바일 앱형 PWA입니다.

이 프로젝트는 단순 혜택 목록 제공을 넘어, 사용자 프로필 기반 조건 매칭, 저장 혜택 보드, 서류 체크리스트, D-Day 일정 관리, AI 추천 이유 생성 기능을 포함한 풀스택 MVP로 구현되었습니다.

추천 기능은 Gemini API에 판단을 전적으로 맡기지 않고, 백엔드에서 Rule-based Scoring으로 추천 후보를 산정한 뒤 Gemini API를 활용해 추천 이유를 생성하는 구조로 설계했습니다.

---

## 2. 기술 스택

| 구분 | 기술 |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion, React Router v7 |
| **Backend** | Node.js, Express 5, TypeScript, Prisma ORM |
| **Database** | MySQL |
| **AI** | Google Gemini Flash API |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Dev Tools** | ts-node-dev, tsx, ESLint |

---

## 3. 주요 기능

### 혜택 탐색
- 카테고리 필터 + 키워드 검색 (API 기반)
- 추천 혜택 우선 노출, 마감임박 D-Day 뱃지

### 내 신청 보드
- 관심 혜택 저장 및 `준비중 / 신청완료 / 대기중 / 완료` 상태 관리
- 혜택별 서류 체크리스트 (ChecklistItem)
- 체크리스트 진행률 Progress Bar

### AI 맞춤 추천
- 사용자 프로필(출생연도·지역·고용상태·소득수준·가구유형·관심분야) 기반
- 백엔드에서만 Gemini API 호출 (프론트엔드 키 노출 없음)
- 추천 점수, 매칭 이유, 주의사항 반환

### 일정 관리
- 마감일 있는 저장 혜택을 D-Day 순 정렬
- D-7 이내 항목 강조 표시

### 마이페이지 설정 시스템
| 기능 | 경로 |
|---|---|
| 계정 설정 (이름 변경, 비밀번호 변경) | `/settings/account` |
| AI 맞춤 프로필 수정 | `/settings/profile` |
| 알림 설정 (마감 7/3/1일, AI 추천, 공지) | `/settings/notifications` |
| 공지사항 목록 + 상세 | `/settings/notices`, `/settings/notices/:id` |
| 이용약관 | `/settings/terms` |
| 개인정보 처리방침 | `/settings/privacy` |
| AI 추천 안내 | `/settings/ai-guide` |
| 회원 탈퇴 | `/settings/withdraw` |

### 인증
- 이메일/비밀번호 회원가입·로그인
- 게스트 모드 (탐색만 가능)
- 소셜 계정 여부 감지 (`hasPassword` 플래그) → 비밀번호 변경 UI 조건부 노출

---

## 4. 화면 구성

| 화면 | 경로 | 설명 |
|---|---|---|
| 스플래시 | `/splash` | 앱 진입 로딩 |
| 온보딩 | `/onboarding` | 최초 가입 안내 |
| 로그인 | `/login` | JWT 인증 |
| 회원가입 | `/register` → `/register/*` | 단계별 가입 플로우 |
| AI 프로필 설정 | `/profile-setup` | 맞춤 추천을 위한 프로필 입력 |
| 홈 | `/` | 추천 혜택 카드, AI 추천 CTA |
| 혜택 탐색 | `/benefits` | 카테고리 필터 + 검색 |
| 혜택 상세 | `/benefits/:id` | 지원내용·서류·신청방법·공식사이트 링크 |
| 신청 보드 | `/board` | 저장한 혜택 상태 관리 |
| 일정 | `/schedule` | D-Day 마감 일정 |
| AI 추천 | `/ai-recommendation` | AI 맞춤 추천 결과 |
| 마이페이지 | `/mypage` | 계정 정보·메뉴 허브 |
| 설정 페이지들 | `/settings/*` | 계정·알림·약관·탈퇴 등 |

---

## 5. API 목록

### 인증 (`/api/auth`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| POST | `/register` | 회원가입 | ✗ |
| POST | `/login` | 로그인 (JWT 발급) | ✗ |
| GET | `/me` | 내 정보 조회 (`hasPassword` 포함) | ✅ |
| PATCH | `/me` | 이름 수정 | ✅ |
| PATCH | `/password` | 비밀번호 변경 (현재 비밀번호 확인) | ✅ |
| DELETE | `/me` | 회원 탈퇴 (연관 데이터 전체 삭제) | ✅ |

### 혜택 (`/api/benefits`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 혜택 목록 (카테고리·키워드 필터, 페이지네이션) | ✗ |
| GET | `/:id` | 혜택 상세 | ✗ |

### 저장 혜택 (`/api/me/saved-benefits`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 저장한 혜택 목록 | ✅ |
| POST | `/` | 혜택 저장 | ✅ |
| DELETE | `/:id` | 저장 혜택 삭제 | ✅ |
| PATCH | `/:id/status` | 신청 상태 변경 | ✅ |
| POST | `/:id/checklist` | 체크리스트 항목 추가 | ✅ |
| PATCH | `/:id/checklist/:itemId` | 체크리스트 항목 수정 | ✅ |
| DELETE | `/:id/checklist/:itemId` | 체크리스트 항목 삭제 | ✅ |

### AI 프로필 (`/api/me/profile`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | AI 프로필 조회 | ✅ |
| PUT | `/` | AI 프로필 저장/수정 (upsert) | ✅ |

### AI 추천 (`/api/ai/recommendations`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | AI 맞춤 혜택 추천 결과 조회 | ✅ |
| POST | `/generate` | Gemini API 호출 후 추천 재생성 | ✅ |

### 알림 설정 (`/api/me/notification-settings`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 알림 설정 조회 (없으면 기본값 생성) | ✅ |
| PUT | `/` | 알림 설정 저장 (upsert) | ✅ |

### 공지사항 (`/api/notices`)
| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 공지 목록 (중요·최신순 정렬) | ✗ |
| GET | `/:id` | 공지 상세 | ✗ |

---

## 6. 데이터 모델

```
User
  ├── passwordHash: String?          # nullable (소셜 로그인 대응)
  ├── SavedBenefit[]                 # onDelete: Cascade
  │     └── ChecklistItem[]          # onDelete: Cascade
  ├── UserProfile?                   # onDelete: Cascade
  ├── AiRecommendation[]             # onDelete: Cascade
  └── NotificationSetting?           # onDelete: Cascade

Benefit
  ├── SavedBenefit[]
  └── AiRecommendation[]

Notice
  ├── isImportant: Boolean
  └── category: String
```

> **회원 탈퇴 시 삭제 순서:** `ChecklistItem` → `SavedBenefit` → `AiRecommendation` → `NotificationSetting` → `UserProfile` → `User` (명시적 트랜잭션 + Prisma Cascade 이중 보호)

---

## 7. 실행 방법

### 사전 준비
- Node.js 20+
- MySQL 서버 실행 중
- Google Gemini API Key

### 환경 변수 설정

**`backend/.env`**
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/govmate"
JWT_SECRET="your-secure-jwt-secret"
GEMINI_API_KEY="your-gemini-api-key"
CORS_ORIGINS="http://localhost:5173"
PORT=4000
```

**`frontend/.env` (선택)**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 설치 및 실행

```bash
# 1. 전체 패키지 설치
npm install
cd backend
npm install
cd ..

# 2. DB 스키마 동기화
cd backend
npx prisma db push

# 3. 시드 데이터 삽입 (혜택 4종 + 공지 3건)
node run-seed.js
cd ..

# 4. 백엔드 실행 (터미널 1)
cd backend
npm run dev

# 5. 프론트엔드 실행 (터미널 2)
npm run dev
```

| 서버 | 주소 |
|---|---|
| 프론트엔드 | http://localhost:5173 |
| 백엔드 API | http://localhost:4000 |

---

## 8. 디렉토리 구조

```
챙김/
├── src/
│   ├── api/               # httpClient, authApi, benefitApi, aiApi 등
│   ├── app/               # App.tsx, router.tsx
│   ├── components/
│   │   ├── common/        # PrimaryButton, Skeleton, EmptyState, Toast, BottomSheet
│   │   └── layout/        # MobileShell, BottomNav, PageTransition
│   ├── constants/         # 카테고리 목록 등 공통 상수
│   ├── pages/
│   │   ├── settings/      # AccountSettingsPage, NotificationsPage, WithdrawPage 등 9개
│   │   └── ...            # HomePage, BenefitsPage, BoardPage 등 주요 화면
│   ├── store/             # useAuthStore, useBenefitStore, useAiRecommendationStore 등
│   ├── types/             # User, Benefit, SavedBenefit 등 공통 타입
│   └── utils/             # date.ts, error.ts 등
│
└── backend/
    ├── src/
    │   ├── controllers/   # auth, profile, benefit, ai, notification, notice
    │   ├── routes/        # 라우터 파일
    │   └── middlewares/   # authMiddleware (JWT 검증)
    ├── prisma/
    │   ├── schema.prisma  # 전체 데이터 모델
    │   └── seed.ts        # 시드 데이터 (혜택 + 공지)
    └── scripts/           # importBenefits.ts, syncBenefits.ts
```

---

## 9. 아키텍처 & 보안

- **JWT 인증**: 모든 Private API는 `Authorization: Bearer <token>` 헤더 검증
- **비밀번호**: bcrypt 단방향 해싱, 응답에 `passwordHash` 절대 미포함 (`hasPassword: boolean` 플래그만 반환)
- **AI API Key**: 백엔드 `.env`에서만 관리, 프론트엔드에 노출 없음
- **CORS**: 허용 Origin을 `.env`의 `CORS_ORIGINS`로 명시적 관리
- **회원 탈퇴**: `req.user.id` 기준으로만 처리, 클라이언트 userId 신뢰 금지
- **소셜 계정 보호**: `passwordHash: null` 사용자는 비밀번호 로그인/변경 API 차단

---

## 10. QA & 빌드 현황

### 빌드
```
✓ frontend  npm run build    → Exit 0 (Vite, 1.78s)
✓ backend   npx tsc --noEmit → Exit 0 (TypeScript 에러 없음)
```

### 모바일 Viewport QA (375px / 390px / 430px)
| 항목 | 결과 |
|---|---|
| 주요 화면 가로 overflow | ✅ 없음 |
| BottomNav 겹침 (pb 처리) | ✅ 해결 |
| 설정 화면 8종 스크롤 | ✅ overflow-y-auto 적용 |
| Benefit Detail CTA 겹침 | ✅ 해결 |
| 카테고리 칩 가로 스크롤 | ✅ 확인 |
| safe-area CSS | ✅ 적용 |

> iOS Safari 및 Android Chrome 실기기 검증은 추가 확인 대상입니다.

---

## 11. 데이터 정책

- 혜택 데이터는 공식 공공데이터 API 또는 공식 CSV 기반으로 관리합니다.
- 프론트엔드는 외부 정부 API를 직접 호출하지 않으며, 백엔드 API 응답만 소비합니다.
- 대량 데이터 적재: `backend/scripts/importBenefits.ts` (CSV import) 또는 `syncBenefits.ts` (공식 API 동기화)
- `backend/import/benefits.sample.csv`는 파이프라인 검증용 데모 데이터입니다. 실 서비스 전 공식 데이터로 교체 필요.

---

## 12. 한계 및 개선 예정

| 구분 | 내용 |
|---|---|
| **서비스 책임 한계** | 정부 신청 대행 서비스가 아닙니다. 실제 자격 확인은 공식 기관에서 직접 진행해야 합니다. |
| **AI 추천 한계** | 입력 프로필 기반 참고용 안내이며, 수급 자격 보장이 아닙니다. |
| **소셜 로그인** | OAuth(카카오/구글) 플로우 미구현. 소셜 계정 구조(passwordHash nullable)는 준비 완료. |
| **공지사항 관리** | 어드민 UI 미구현. 현재는 DB 직접 삽입 또는 시드로 관리. |
| **배포** | CORS 설정 고도화, HTTPS, 환경 변수 분리 등 운영 환경 배포 작업 미완. |
| **PWA 고도화** | Service Worker, 오프라인 지원, 실제 푸시 알림 연동 미완. |
