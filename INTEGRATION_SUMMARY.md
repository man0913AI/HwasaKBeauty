# HWASA K-Beauty 홈페이지 + ERP 통합 완료

> **최종 상태**: 2026-04-26 | 100% 통합 및 기능 검증 완료

---

## 프로젝트 구조

```
HwasaKBeauty/
├── [ROOT] 홈페이지 파일들
│   ├── index.html                          ← 진입점 (PAGE_MAIN.html로 리디렉트)
│   ├── PAGE/PAGE_MAIN.html                 ← 홈페이지 메인
│   ├── PAGE/PAGE_ABOUT.html
│   ├── PAGE/PAGE_ACADEMY.html
│   ├── PAGE/PAGE_CONTACT.html
│   ├── PAGE/PAGE_DIPLOMA.html
│   ├── PAGE/PAGE_E_CHART.html              ← 전자차트
│   ├── PAGE/PAGE_LETTER.html
│   ├── PAGE/PAGE_PROGRAM.html
│   ├── PAGE/PAGE_SELF_BEAUTY.html
│   ├── PAGE/PAGE_MARKET.html
│   │
│   ├── [REDIRECT FILES]
│   ├── about.html, academy.html, contact.html, etc.
│   │
│   ├── [IMAGES]
│   ├── IMAGE/                              ← 홈페이지 이미지 (5.5MB)
│   ├── DIPLOMA/                            ← 디플로마/자격증 이미지
│   ├── LETTER/                             ← 추천서 이미지
│   └── SELF_BEAUTY/                        ← 셀프뷰티 이미지
│
└── [ERP SYSTEM]
    └── PAGE/
        ├── PAGE_ERP.html                   ← ERP 로그인 페이지
        ├── PAGE_ERP_SALES.html             ← 매출 관리 (기본 진입점)
        ├── PAGE_ERP_PURCHASE.html          ← 매입 관리
        ├── PAGE_ERP_COMMUTE.html           ← 출퇴근 관리
        ├── PAGE_ERP_MEMBER_SALARY.html     ← 급여 관리
        ├── PAGE_ERP_CLOSING.html           ← 결산
        ├── PAGE_ERP_EMPLOYEE_CONTRACT.html ← 계약서
        ├── PAGE_ERP_CUSTOMER_MANAGEMENT.html ← 고객 관리
        ├── PAGE_ERP_MASTER.html            ← 마스터 데이터 (대시보드 포함)
        │
        ├── [SHARED LIBRARIES]
        ├── ERP_COMMON.js                   ← DataService, React Context, 공통 유틸
        ├── ERP_STYLE.css                   ← 전체 ERP 스타일시트
        └── [APPS_SCRIPT/]                  ← Google Apps Script 백엔드 (선택사항)
```

---

## 통합 포인트 (홈페이지 ↔ ERP)

### 1️⃣ 홈페이지 → ERP 진입
- **위치**: PAGE_MAIN.html 푸터 하단 "ERP" 링크
- **대상**: PAGE_ERP.html (로그인 페이지)
- **CSS**: `.footer-erp-link` 스타일링 (황금색)

```html
<!-- PAGE_MAIN.html 푸터 -->
<a href="PAGE_ERP.html" class="footer-erp-link">ERP</a>
```

### 2️⃣ ERP 로그인 페이지
- **파일**: PAGE_ERP.html
- **기능**: 직원 인증 (3개 기본 계정 제공)
- **인증 후**: 세션스토리지에 사용자 정보 저장
- **진입**: PAGE_ERP_SALES.html 로 자동 이동

### 3️⃣ ERP 홈 버튼 → 홈페이지 복귀
- **위치**: PAGE_ERP.html 우측 상단 "← 홈으로" 링크
- **대상**: PAGE_MAIN.html (홈페이지)

```html
<!-- PAGE_ERP.html 상단 -->
<a href="PAGE_MAIN.html" class="home-link">
  <svg>...</svg> 홈으로
</a>
```

---

## 기본 로그인 계정

| 아이디 | 비밀번호 | 역할 | 이름 |
|--------|---------|------|------|
| `admin` | `hwasa2023` | 관리자 | 이화사 원장 |
| `galaxy0219` | `0716` | 원장 | Galaxy |
| `manager` | `0716` | 매니저 | Manager |

> ⚠️ **보안**: 운영 환경에서는 반드시 PASSWORD를 변경하고 Google Apps Script 백엔드 연동

---

## ERP 기능 요약

### Phase 1 — Master Data (대시보드 포함)
- ✅ 프로그램/메뉴/이벤트/직원/등급 관리
- ✅ 대시보드 (오늘 매출/출근/이벤트)
- ✅ JSON 백업/복원

### Phase 2 — Sales (매출)
- ✅ 일별 매출 입력
- ✅ 고객 자동완성
- ✅ 담당자(therapist) 컬럼
- ✅ 이벤트/할인 자동반영
- ✅ 메뉴 구성 팝업
- ✅ 영수증 인쇄

### Phase 3 — Commute (출퇴근)
- ✅ 월별 달력 그리드
- ✅ 시간 입력 모달
- ✅ 지문기 XLS 업로드
- ✅ 직원별 뷰

### Phase 4 — Salary (급여)
- ✅ 4단계 워크플로우 (계산→검토→확정→지급)
- ✅ 팁 귀속 계산
- ✅ 급여명세서 인쇄

### Phase 5 — Closing (결산)
- ✅ 월/분기/반기/연간 탭
- ✅ YoY 비교
- ✅ 엑셀 내보내기

### Phase 6 — Auth (권한 관리)
- ✅ 역할별 메뉴 접근 제어
- ✅ AdminService (페이지 ID 별칭)

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| **UI Framework** | React 18.2.0 (CDN) |
| **JSX Compilation** | Babel Standalone 7.23.5 |
| **빌드 도구** | 없음 (브라우저 실시간 컴파일) |
| **데이터 저장** | localStorage (Phase 1) / Google Apps Script (선택) |
| **스타일링** | CSS Variables + CSS Grid |
| **호스팅** | GitHub Pages (main branch) |

---

## 배포 상태

| 체크포인트 | 상태 |
|-----------|------|
| 홈페이지 (13개 페이지) | ✅ 완성 |
| ERP 시스템 (8개 페이지) | ✅ 완성 |
| 공통 라이브러리 | ✅ 완성 |
| 네비게이션 통합 | ✅ 완성 |
| 인증 시스템 | ✅ 완성 |
| 권한 관리 | ✅ 완성 |
| 이미지 자산 (5.5MB) | ✅ 완성 |
| GitHub 리포지토리 | ✅ 푸시 완료 |
| GitHub Pages 설정 | ✅ main branch 자동 호스팅 |

---

## 사용 방법

### 홈페이지 접근
```
https://man0913ai.github.io/HwasaKBeauty/
```

### ERP 접근 (홈페이지에서)
1. 홈페이지 하단의 "ERP" 링크 클릭
2. 로그인 페이지에서 계정 입력
   - 아이디: `admin`
   - 비밀번호: `hwasa2023`
3. 로그인 버튼 클릭
4. PAGE_ERP_SALES.html 으로 자동 이동
5. ERP 시스템 사용

### 홈페이지로 복귀
- ERP 페이지의 "← 홈으로" 클릭
- 또는 브라우저의 뒤로가기 사용

---

## 향후 개선사항

### 필수 작업
- [ ] Google Apps Script 백엔드 배포 (SPREADSHEET_ID 설정)
- [ ] 운영 계정 추가 및 비밀번호 변경
- [ ] 데이터 마이그레이션 (기존 시스템 → ERP)

### 권장 사항
- [ ] 휴대폰 앱 래퍼 (React Native / Flutter)
- [ ] 오프라인 동기화 (IndexedDB)
- [ ] 보고서 내보내기 (PDF/Excel) 확대
- [ ] 푸시 알림 (웹 알림 API)
- [ ] 다국어 지원 (i18n)

---

## 파일 조직

### 홈페이지 파일 (ROOT)
- `index.html` — 진입점 (자동 리디렉트)
- 10개 리다이렉트 파일 (구식 경로 호환)
- `PAGE_ERP_CUSTOMER_MANAGEMENT.html` — 루트에 추가된 파일 (PAGE/ 폴더와 동기화됨)

### 홈페이지 콘텐츠 (PAGE/)
- `PAGE_MAIN.html` — 메인 홈페이지
- `PAGE_*.html` — 개별 페이지들 (9개)

### ERP 시스템 (PAGE/)
- `PAGE_ERP.html` — 로그인
- `PAGE_ERP_*.html` — ERP 기능 페이지 (8개)
- `ERP_COMMON.js` — 공유 라이브러리
- `ERP_STYLE.css` — 통합 스타일시트

### 자산 (IMAGE/, DIPLOMA/, LETTER/, SELF_BEAUTY/)
- 홈페이지 배경/콘텐츠 이미지
- 디플로마 인증서 이미지
- 추천서/편지 이미지
- 셀프뷰티 가이드 이미지

---

## GitHub 구성

- **Repository**: man0913AI/HwasaKBeauty
- **Branch**: main (primary)
- **Pages**: https://man0913ai.github.io/HwasaKBeauty/
- **최근 커밋**: 
  - Phase 6: AuthService 권한 관리
  - Phase 5: 결산 엑셀 내보내기
  - Phase 4: 급여명세서 Print CSS
  - Phase 1-3: 버그 수정 및 통합

---

## 문제 해결

### 이미지가 보이지 않음
- IMAGE/, DIPLOMA/, LETTER/, SELF_BEAUTY/ 폴더가 GitHub에 푸시되었는지 확인
- 경로: `./IMAGE/` 로 상대 경로 사용

### ERP 로그인 실패
- 브라우저 콘솔(F12)에서 오류 메시지 확인
- sessionStorage 제거 후 재시도: `sessionStorage.clear()`

### 데이터 손실
- 브라우저 개발자 도구 → Application → Local Storage 에서 확인
- 자동 백업은 localStorage에 저장됨 (JSON 형식)

---

**프로젝트 완료일**: 2026-04-26  
**총 파일 수**: 35+ HTML/JS/CSS 파일 + 5.5MB 이미지 자산  
**총 라인 수**: ~6,000 라인 (ERP 코드) + 2,000 라인 (홈페이지 코드)
