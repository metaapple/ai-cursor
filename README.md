# 국민은행 가계부 (Demo)

Vue 3 + Composition API + Vue Router + Bootstrap 기반의 **가계부 데모 SPA**입니다.  
기본 테마 색상은 **오렌지**이며, 제출/전환 시 **로딩 스피너 오버레이**가 표시됩니다.

## 사용 기술

- Frontend: `Vue 3`, `Composition API`, `Vue Router`, `Bootstrap 5`, `Pinia`
- UI/아이콘: `Font Awesome`
- 차트: `Chart.js`
- Backend 샘플: `json-server`

## 전체 실행 방법

터미널을 2개 열어서 각각 실행하세요.

1. 프론트엔드
```bash
npm install
npm run dev
```
브라우저: `http://localhost:5173/`

2. json-server(API)
```bash
npm run api
```
기본 포트: `3001`

## 라우팅(페이지)

- `/login`: 로그인
- `/signup`: 회원가입
- `/login-success`: 로그인 성공(환영 카드)
- `/ledger`: 가계부(수입/지출 기록 CRUD + 필터)
- `/dashboard`: 대시보드(KPI 3개 + 차트 3개)

## Header / 로고 클릭 동작

- Layout은 `header` / `content` / `footer`로 구성됩니다.
- Header의 **KB 로고(이미지)를 클릭**하면 현재 라우트를 기준으로 로그인/회원가입 화면으로 전환합니다.
- 로그인 상태에서는 Header의 `로그인`/`회원가입` 버튼이 숨김 처리되고,
  - 대신 사용자 이름 표시 + `로그아웃` 버튼이 노출됩니다.

## 로그인/회원가입 동작(세션)

세션은 Pinia `members` 스토어에서 `localStorage`로 관리합니다.

- `src/stores/members.js`
  - `signup({ name, email, password })`
  - `login({ email, password })`
  - `logout()`

### json-server에 있는 데모 계정(예시)

`server/db.json`의 `members`에 다음 형태로 샘플이 들어있습니다(100명).

- 예: `user001@kb-demo.com` / `Password!001`
- 예: `user002@kb-demo.com` / `Password!002`
- 예: `user100@kb-demo.com` / `Password!100`

> 주의: `server/db.json`의 비밀번호는 **데모용 평문 샘플**입니다. 실제 서비스에서는 절대 사용하면 안 됩니다.

## json-server API(엔드포인트)

`npm run api` 실행 시 기본적으로 다음 리소스를 제공합니다.

- 회원
  - `GET/POST /members`
  - `GET /members?id=...`
- 가계부 엔트리
  - `GET/POST /ledgerEntries`
  - `PUT /ledgerEntries/:id`
  - `DELETE /ledgerEntries/:id`

### 사용자별 조회 예시

`memberId` 기준으로 조회할 때는 아래처럼 쿼리를 붙입니다.

`/ledgerEntries?memberId=1&_sort=date&_order=desc`

## Pinia 스토어(연동 코드)

- `src/stores/members.js`
  - 로그인/회원가입/로그아웃 + 세션 저장
- `src/stores/account.js`
  - 로그인 사용자(`memberId`) 기준으로 `ledgerEntries`를 조회/추가/수정/삭제

> 현재 `/ledger`, `/dashboard` UI는 데모용으로 `src/lib/ledger.js`(localStorage) 데이터를 사용합니다.  
> `account.js`로 API 연동을 “완전히” 연결하려면 `LedgerView.vue`/`DashboardView.vue`에서 localStorage 호출을 `account.js`의 메서드로 교체하면 됩니다.

## 가계부 / 대시보드 UI 요약

- `/ledger`
  - 수입/지출 입력(카테고리 프리셋 + 직접 입력 가능)
  - 기록 수정/삭제
  - 기간/구분/검색 필터
  - 로딩 스피너 오버레이
- `/dashboard`
  - KPI 3개: 총 수입 / 총 지출 / 순이익
  - 차트 3개: 월별 지출(Bar), 지출 카테고리(Doughnut), 월별 수입·지출(Line)
  - Chart.js 렌더링

## 구성 파일 위치

- `src/components/layout/*`: `header` / `footer`
- `src/views/*`: 로그인/회원가입/성공/가계부/대시보드 페이지
- `src/lib/*`: localStorage 데모 로직(`ledger.js`), API 헬퍼(`api.js`)
- `server/db.json`: json-server DB(회원 100명 + ledgerEntries 샘플)

## 문제 해결

- `npm run api`를 실행했는데 차트/데이터가 안 나오면
  - 먼저 프론트가 실행 중인지(`npm run dev`) 확인하세요.
- 기본 API 주소가 다르면
  - `VITE_API_BASE` 환경변수로 조정할 수 있습니다.

