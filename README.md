# 국민은행 가계부 (Demo)
<img width="1782" height="1655" alt="253" src="https://github.com/user-attachments/assets/e668613c-de43-4759-b942-e0a9ee1c774b" />
<img width="1782" height="1655" alt="254" src="https://github.com/user-attachments/assets/3cf300f3-3fb8-438a-a7a4-0cf62e1da804" />
<img width="1782" height="1655" alt="255" src="https://github.com/user-attachments/assets/29651a9a-b294-4f5a-b482-e71442ee8954" />
<img width="1782" height="1655" alt="256" src="https://github.com/user-attachments/assets/10beee12-6175-48e8-be0c-7234fefeec9b" />
<img width="1782" height="1655" alt="257" src="https://github.com/user-attachments/assets/8f0bf15c-c958-4c37-a8d4-90193365598d" />
<img width="1782" height="1655" alt="258" src="https://github.com/user-attachments/assets/07639576-a7b4-4af5-821a-8f762e246de6" />



<img width="201" height="230" alt="251" src="https://github.com/user-attachments/assets/18bcae02-a6c0-469b-ba89-64706ed4d828" />
<img width="478" height="525" alt="252" src="https://github.com/user-attachments/assets/f1879e68-a247-44c9-b153-b62ee9f51d34" />
<img width="1966" height="1472" alt="250" src="https://github.com/user-attachments/assets/32765462-5329-4401-b2f2-ba2c60005ce7" />
<img width="2753" height="1805" alt="image" src="https://github.com/user-attachments/assets/cfe120a1-3886-458d-b282-06ee3392ef4d" />


<br><br><br><br><br><br><br>

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

## 깃연결
<img width="745" height="640" alt="232" src="https://github.com/user-attachments/assets/6b9bd3fd-0535-4588-abc7-207b1508acaf" />
<img width="1228" height="778" alt="233" src="https://github.com/user-attachments/assets/af17d4be-c5e2-473d-889a-681dca0ff740" />
<img width="1989" height="150" alt="234" src="https://github.com/user-attachments/assets/8fc7b309-9820-483b-8304-c9622ca1f6ab" />
<img width="1147" height="698" alt="235" src="https://github.com/user-attachments/assets/b7f73d5e-a9b2-4d7f-a604-96bb02cc5ef3" />
<img width="1049" height="304" alt="236" src="https://github.com/user-attachments/assets/c7a50f67-7da3-4177-82b1-f92814c96bfe" />
<img width="866" height="690" alt="237" src="https://github.com/user-attachments/assets/a8997cce-68d0-458f-9baf-e2c56fec2bfb" />
<img width="648" height="950" alt="238" src="https://github.com/user-attachments/assets/307f975c-332b-44b7-be41-373d228f7a3b" />
<img width="2088" height="1491" alt="239" src="https://github.com/user-attachments/assets/47e3a819-b508-4fae-94a9-02fab197383e" />
<img width="287" height="92" alt="240" src="https://github.com/user-attachments/assets/58305f53-bea2-46f5-be13-5b840c030dc7" />
<img width="1427" height="123" alt="241" src="https://github.com/user-attachments/assets/02b39999-3812-404c-a5b0-3044cc0c65bb" />
<img width="2017" height="157" alt="242" src="https://github.com/user-attachments/assets/f8abd78f-321e-4062-815a-87a6493f9b74" />
<img width="1979" height="839" alt="243" src="https://github.com/user-attachments/assets/67492878-a452-44aa-aeb7-2aaf3f8374a7" />
<img width="3804" height="1649" alt="244" src="https://github.com/user-attachments/assets/2e5bad81-6c2f-455a-982a-c26196fdb203" />
<img width="1077" height="129" alt="247" src="https://github.com/user-attachments/assets/42a23075-b24c-49da-9af0-e88887c818ac" />
<img width="1085" height="1148" alt="248" src="https://github.com/user-attachments/assets/e79f5b23-b510-4ead-a18d-6faf9bae93c4" />
<img width="1032" height="271" alt="249" src="https://github.com/user-attachments/assets/a3e66ee7-c3dc-4583-a1bc-eeda7fba7a9c" />







