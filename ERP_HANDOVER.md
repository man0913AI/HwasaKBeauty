# HWASA K-Beauty ERP - 작업 현황 (Claude Code 인수인계)

> 작성일: 2026-04-30  
> 작성: Claude.ai (claude-sonnet-4-6)  
> 인수: Claude Code CLI  

---

## 프로젝트 기본 정보

- **GitHub**: man0913AI/HwasaKBeauty  
- **배포 URL**: https://man0913ai.github.io/HwasaKBeauty/  
- **로컬 테스트**: python -m http.server 8080 (Windows)  
- **아키텍처**: React 18 CDN + Babel SPA, GitHub REST API v3  
- **GitHub PAT**: localStorage `hskb_gh_token` 에 저장됨  
- **주요 파일**:
  - `PAGE/ERP_COMMON.js` — ERP 공통 CSS, DataService, ERP_PAGES 정의 (40KB)
  - `PAGE/DATA_CONNECTOR.js` — GitHub data/ 폴더에서 자동 데이터 주입 (8KB)
  - `PAGE/DATA_SERVICE.js` — 무해화됨 (빈 주석만, 건드리지 말 것)

---

## 데이터 파일 (data/ 폴더)

| 파일 | 건수 | 상태 |
|------|------|------|
| customers.json | 771명 | ✅ 정상 |
| sales_2026_1.json | 621건 | ✅ 정상 |
| sales_2026_2.json | 622건 | ✅ 정상 |
| expenses_2026.json | 84건 | ✅ 정상 |
| customer_charts_1.json | 94건 | ✅ 정상 |
| customer_charts_2.json | 94건 | ✅ 정상 |
| closing_pl.json | 5건 | ✅ 정상 |

---

## ERP 네비게이션 구조 (현재)

```
마스터 (hover → 드롭다운)
  ├── 고객
  ├── 계약서
  ├── 출퇴근
  └── 월급여
매출
매입
결산
캘린더
```

---

## ERP 페이지별 현재 상태

### ✅ 정상 확인된 것

| 페이지 | 탭 | 상태 |
|--------|-----|------|
| PAGE_ERP_SALES.html | 일일 입력 | ✅ 정상 |
| PAGE_ERP_SALES.html | 매출 내역 | ✅ 날짜별 실제 데이터 표시 |
| PAGE_ERP_PURCHASE.html | 매입 입력 | ✅ 정상 |
| PAGE_ERP_PURCHASE.html | 매입 내역 | ✅ 84건 실제 데이터 표시 |
| PAGE_ERP_CUSTOMER_MANAGEMENT.html | 고객 목록 | ✅ 771명 표시 |

### ❌ 미확인 / 수정 필요

| 페이지 | 탭 | 문제 |
|--------|-----|------|
| PAGE_ERP_SALES.html | 월별 요약 | 미확인 |
| PAGE_ERP_PURCHASE.html | 통계 | 미확인 |
| PAGE_ERP_CLOSING.html | 전체 탭 | 미확인 |
| PAGE_ERP_COMMUTE.html | 전체 탭 | 미확인 |
| PAGE_ERP_MEMBER_SALARY.html | 전체 탭 | 미확인 |
| PAGE_ERP_EMPLOYEE_CONTRACT.html | 전체 탭 | 미확인 |
| PAGE_ERP_MENU.html | 전체 탭 | 미확인 |
| PAGE_ERP_MASTER.html | 전체 탭 | 미확인 |

---

## DATA_CONNECTOR.js 동작 방식

페이지 로드 시 자동으로 GitHub data/ 폴더에서 데이터를 가져와 DataService에 주입:

```javascript
// 주입 구조
DataService._store.customers = [...] // 771명 배열
DataService._store.sales = {         // 날짜별 맵
  '2026-03-01': { rows: [...], expenses: [] },
  '2026-03-02': { rows: [...], expenses: [] },
  ...
}
DataService._store.purchase = [...]  // 84건 배열
DataService._store.salesByMonth = {  // 월별 인덱스
  '1월': [...], '2월': [...], '3월': [...]
}
DataService._store.salesAllRecords = [...] // 전체 1243건
```

---

## 고객 데이터 스키마 (GitHub data/customers.json)

```json
{
  "id": "CUST-3001",
  "chartNo": "3001",
  "name": "이영미",
  "memberGrade": "SILVER",
  "gender": "F",
  "phone": "762092752",
  "birthdate": "1979-02-04",
  "note": "메모",
  "color": "#B8956A",
  "visitHistory": []
}
```

**중요**: ERP 컴포넌트는 payments, mileage, history 필드를 기대하지만
실제 데이터에는 없음 → normalizeCustomer() 함수로 변환 처리됨
(PAGE_ERP_CUSTOMER_MANAGEMENT.html 내부에 있음)

---

## 매출 데이터 스키마 (GitHub data/sales_2026_1.json)

```json
{
  "id": "SALE-xxx",
  "date": "2026-03-01",
  "month": "3월",
  "customerName": "홍길동",
  "memberGrade": "SILVER",
  "program": "두피관리",
  "cash": 150000,
  "cashPlus10": 165000,
  "card": 0,
  "krw": 0,
  "unpaid": 0,
  "tipDeduct": 0,
  "deductAmount": 0,
  "isEvent": false,
  "isVIP": false
}
```

---

## 지출 데이터 스키마 (GitHub data/expenses_2026.json)

```json
{
  "id": "EXP-1월-0001",
  "date": "2026-01-01",
  "month": "1월",
  "rawMaterial": 0,
  "subMaterial": 0,
  "infrastructure": 0,
  "labor": 0,
  "tips": 0,
  "other": 0,
  "note": "비고"
}
```

---

## 알려진 이슈 및 주의사항

### 1. DATA_SERVICE.js 주의
- `PAGE/DATA_SERVICE.js` 는 무해화됨 (빈 주석만)
- **절대 수정하거나 내용 추가하지 말 것** → ERP 렌더링 깨짐

### 2. 방어 코드 패턴
각 ERP 페이지에서 데이터 접근 시 반드시 방어 코드 사용:
```javascript
// 잘못된 방법
data.rows.reduce(...)

// 올바른 방법
(data.rows||[]).reduce(...)
(data[dt]||{rows:[],expenses:[]}).rows
```

### 3. 정규식 교체 주의
- `rows.map` → `(Array.isArray(rows)?rows:[]).map` 으로 교체할 때
- **반드시** `p.rows`, `d.rows` 같은 object property 접근은 제외해야 함
- 독립 변수명에만 적용할 것

### 4. 로컬 테스트 방법
```bash
# Windows CMD 창 1
cd C:\Users\man09\HwasaKBeauty
python -m http.server 8080

# Windows CMD 창 2 (auto_pull.bat)
cd C:\Users\man09\HwasaKBeauty
@echo off
:loop
git pull --quiet
timeout /t 5 /nobreak >nul
goto loop
```
브라우저: http://localhost:8080/PAGE/PAGE_ERP_SALES.html

---

## Claude Code 다음 작업 지시

```
우선순위 1: 전체 ERP 페이지 탭별 점검
- 각 페이지의 모든 탭을 클릭했을 때 에러 없이 렌더링되는지 확인
- 로컬 서버 http://localhost:8080 기준으로 테스트
- 에러 발생 시 즉시 수정 후 로컬에서 재확인

우선순위 2: 실제 데이터 연동 확인
- 매출 월별 요약 탭: DataService._store.salesByMonth 데이터 사용
- 결산 페이지: DataService._store.closing 연동
- 출퇴근 페이지: 기본 UI 동작 확인

우선순위 3: 완성 후 한 번에 git push
- 로컬에서 모든 페이지 확인 완료 후
- git add . && git commit -m "Fix: 전체 ERP 페이지 데이터 연동 완료" && git push
```

---

## 최근 커밋 이력 (주요)

| SHA | 내용 |
|-----|------|
| d9a6c8d | Fix: d.rows undefined 방어 (data[dt] 기본값) |
| 360f484 | Fix: sales 주입 날짜별 맵 구조 변환 |
| 21ab286 | Fix: normalizeCustomer 추가 (고객 데이터 정규화) |
| ba9cb0f | Feat: 출퇴근·월급여 마스터 하위 드롭다운 이동 |
| ef1b8c8 | Feat: 계약서 마스터 하위 드롭다운 이동 |
| 81d7ca5 | Feat: 고객 메뉴 마스터 하위 드롭다운 이동 |
| 0047c74 | Fix: DATA_SERVICE.js 무해화 |
| d52b56e | Fix: DATA_SERVICE.js 제거 (8개 ERP 페이지) |
