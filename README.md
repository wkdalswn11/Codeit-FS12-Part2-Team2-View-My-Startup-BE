# View My Startup Backend

스타트업 기업 정보를 관리하고, 모의 투자 및 기업 비교 기능을 제공하는 웹 서비스의 Backend 프로젝트입니다.  
기업 정보 조회, 투자 CRUD, 관심 기업 관리, 비교 기능, 랭킹 시스템 등을 위한 REST API를 제공합니다.

---

## 프로젝트 소개

**View My Startup Backend**는 스타트업 정보와 투자 데이터를 효율적으로 관리하고,  
Frontend와의 API 통신을 통해 사용자에게 안정적인 서비스를 제공하기 위해 구현되었습니다.

주요 목표는 다음과 같습니다.

- 스타트업 기업 정보 API 제공
- 투자 등록 / 수정 / 삭제 기능 구현
- 관심 기업 및 비교 기업 관리
- 투자 랭킹 시스템 제공
- Prisma 기반 데이터베이스 설계 및 관리

---

## 주요 기능

### 1. 기업 관리 API

- 전체 기업 목록 조회
- 기업 검색 기능
- 정렬 및 페이지네이션 지원
- 기업 상세 정보 조회

### 2. 투자 관리 API

- 투자 등록 (Create)
- 투자 수정 (Update)
- 투자 삭제 (Delete)
- 투자 내역 조회 (Read)

### 3. 관심 기업 (Favorite)

- 관심 기업 추가 / 제거
- 마지막 선택 시간 관리

### 4. 기업 비교 기능

- 비교 기업 추가 / 제거
- 최대 5개 기업 관리

### 5. 랭킹 시스템

- 누적 투자 금액 기준 기업 순위 제공
- 매출, 고용 인원, 투자 유치 금액 등 다양한 기준으로 정렬 가능
- 기업별 투자 현황을 비교하며 랭킹 확인 가능

---

## 기술 스택

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

---

## 주요 사용 기술

- RESTful API 설계
- Fetch 기반 Frontend 연동
- localStorage 기반 사용자 식별 (`userId`)
- 통일된 Response 구조 관리
- Pagination 처리

---

## 프로젝트 구조

    ## 프로젝트 구조

    backend
     ┣ .github
     ┣ BE
     ┃ ┗ src
     ┃   ┣ controllers          # 요청 / 응답 처리
     ┃   ┃ ┣ auth.controller.js
     ┃   ┃ ┣ company.controller.js
     ┃   ┃ ┣ compare.controller.js
     ┃   ┃ ┣ favorite.controller.js
     ┃   ┃ ┣ investment.controller.js
     ┃   ┃ ┗ selection.controller.js
     ┃   ┣ middlewares          # 미들웨어
     ┃   ┃ ┣ error.middleware.js
     ┃   ┃ ┗ validate.middleware.js
     ┃   ┣ routes               # API 라우팅
     ┃   ┃ ┣ auth.routes.js
     ┃   ┃ ┣ company.routes.js
     ┃   ┃ ┣ compare.routes.js
     ┃   ┃ ┣ favorite.routes.js
     ┃   ┃ ┣ investment.routes.js
     ┃   ┃ ┗ selection.routes.js
     ┃   ┣ services             # 비즈니스 로직
     ┃   ┃ ┣ auth.service.js
     ┃   ┃ ┣ company.service.js
     ┃   ┃ ┣ compare.service.js
     ┃   ┃ ┣ favorite.service.js
     ┃   ┃ ┣ investment.service.js
     ┃   ┃ ┗ selection.service.js
     ┃   ┣ utils                # 공통 유틸
     ┃   ┃ ┣ companySummary.js
     ┃   ┃ ┣ pagination.js
     ┃   ┃ ┣ response.js
     ┃   ┃ ┣ sort.js
     ┃   ┃ ┗ userValidation.js
     ┃   ┣ app.js               # 서버 설정
     ┃   ┗ server.js            # 서버 실행 파일
     ┣ prisma
     ┃ ┣ migrations             # 마이그레이션 파일
     ┃ ┣ schema.prisma          # DB 스키마 정의
     ┃ ┗ seed.js                # 초기 데이터 생성
     ┣ .env                     # 환경 변수
     ┣ .gitignore
     ┣ package-lock.json
     ┗ package.json             # 프로젝트 설정

---

## API 설계 특징

### 통일된 Response 구조

    {
      "data": {},
      "meta": {},
      "error": null
    }

### 설계 원칙

- Pagination 정보는 `meta`에서 관리
- 사용자 식별은 `userId` 기반 처리
- `userEmail` 대신 `userId` 사용
- 정렬 및 검색 조건을 Query Parameter로 처리
- RESTful 방식의 API 설계

---

## 주요 DB 모델

### 테이블

- User
- Company
- Investment
- Favorite
- Comparison

### 주요 관계

- 한 명의 User는 여러 Investment를 가질 수 있음
- 한 Company는 여러 Investment를 가질 수 있음
- Favorite / Comparison은 별도 테이블로 관리
- Favorite는 `isActive`, `lastSelectedAt` 필드 포함

---

## Prisma Schema 특징

- Enum 사용 (`CompanyCategory`, `InvestmentStatus`)
- Seed Script를 통한 초기 기업 데이터 생성
- Clearbit 로고 기반 기업 이미지 관리
- Prisma Migration 기반 DB 버전 관리

---

## 실행 방법

### 서버 실행

    cd backend
    npm install
    npx prisma generate
    npx prisma migrate dev
    node BE/src/server.js

### Seed 데이터 실행

    node prisma/seed.js

---

## 프로젝트 회고

이번 Backend 프로젝트를 통해

- REST API 설계 방식
- Prisma를 활용한 ORM 구조 설계
- 데이터베이스 모델링 및 관계 설정
- Controller / Service Layer 분리
- 실제 서비스 흐름 기반 서버 로직 구현

을 경험할 수 있었습니다.

특히  
“실무적인 API 구조 설계”와  
“유지보수 가능한 Backend 아키텍처 구성”에 대해 깊이 이해할 수 있었습니다.

---

## GitHub

### Backend Repository

    GitHub Backend Repository Link

(실제 GitHub 링크로 교체해주세요)

---
