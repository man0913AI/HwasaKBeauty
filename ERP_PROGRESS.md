# HWASA K-Beauty ERP — 개발 진행 기록

> 최종 업데이트: 2026-04-12

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 기술 스택 | React 18 CDN + Babel Standalone (빌드 불필요) |
| 백엔드 | Google Apps Script + Google Sheets (Phase 1) |
| 호스팅 | GitHub Pages (man0913ai/HwasaKBeauty) |
| 로컬 경로 | `C:\Users\man09\HwasaKBeauty\PAGE\` |
| 공통 모듈 | `ERP_COMMON.js` (DataService, CSS, MASTER, BackupService) |

---

## 에이전트 구성

### Ollama 3 GPU 인스턴스

| 에이전트 | GPU | 포트 | 모델 | 역할 |
|---------|-----|------|------|------|
| **Agent A** | GPU 0 (GTX 1070 Ti) | 11434 | agent-coder (qwen3.5:9b) | 코드 생성·수정 |
| **Agent B** | GPU 1 (GTX 1070 Ti) | 11435 | agent-reviewer (qwen3.5:9b) | 코드 리뷰 |
| **Agent C** | GPU 2 (GTX 1070) | 11436 | agent-qa (qwen3.5:9b) | QA·검증 (GPU+CPU 혼합) |

### CLI 에이전트

| 도구 | 백엔드 | 실행 명령 |
|------|--------|----------|
| **Aider** (Agent A) | GPU 0 :11434 | `OPENAI_API_BASE=http://127.0.0.1:11434/v1 OPENAI_API_KEY=ollama PYTHONUTF8=1 aider --model openai/agent-coder` |
| **Goose** (Agent B) | GPU 1 :11435 | `OLLAMA_HOST=http://127.0.0.1:11435 GOOSE_PROVIDER=ollama GOOSE_MODEL=agent-reviewer goose` |
| **OpenCode** (Agent D) | GPU 0 :11434 | `opencode` (`~/.config/opencode/config.json` 적용) |
| **Gemini CLI** (Agent D) | Cloud (Gemini 2.5) | `gemini -p "task"` ※ Google 계정 인증 필요 |

> **Open Interpreter**: venv-tts 환경의 prompt_toolkit이 MSYS2/bash와 충돌 → CLI 위임 불가

### Ollama 시작 스크립트

| 파일 | 용도 |
|------|------|
| `C:\ollama-start-gpu0.bat` | GPU 0 단독 (포트 11434) |
| `C:\ollama-start-gpu1.bat` | GPU 1 단독 (포트 11435) |
| `C:\ollama-start-gpu2.bat` | GPU 2 단독 (포트 11436) |
| `C:\ollama-start-all.bat` | 3 인스턴스 동시 시작 |

### 작업 환경

| 파일 | 용도 |
|------|------|
| `C:\Users\man09\erp-workspace.bat` | Windows Terminal 4분할 실행 |
| `C:\Users\man09\gpu-monitor.bat` | GPU VRAM + Ollama 포트 5초 모니터 |

**4분할 레이아웃:**
```
┌──────────────────────┬──────────────────────┐
│  Claude Code         │  Aider               │
│  [ERP Main]          │  [GPU0 agent-coder]  │
├──────────────────────┼──────────────────────┤
│  Goose               │  GPU Monitor         │
│  [GPU1 agent-reviewer]│  (5초 자동 갱신)     │
└──────────────────────┴──────────────────────┘
```

---

## 페이즈 구현 현황

### Phase 1 — Google Apps Script 백엔드

| 파일 | 상태 | 내용 |
|------|------|------|
| `APPS_SCRIPT/Code.gs` | ✅ 완성 | doGet/doPost 라우터, 전 테이블 CRUD |
| `APPS_SCRIPT/Init.gs` | ✅ 완성 | initializeAll() — 마스터/고객/계약/급여 초기 데이터 |
| `PAGE/ERP_COMMON.js` | ✅ 완성 | APPS_SCRIPT_URL 토글, API 우선 + in-memory 폴백 |

**Apps Script 배포 절차 (사용자 직접):**
```
1. https://script.google.com → 새 프로젝트
2. Code.gs + Init.gs 내용 붙여넣기
3. SPREADSHEET_ID = '실제_시트_ID' 로 교체
4. ▶ initializeAll() 실행 (1회만)
5. 배포 → 웹 앱 → 액세스: 모든 사용자 (익명 포함)
6. 배포 URL → ERP_COMMON.js 의 APPS_SCRIPT_URL = '...' 에 입력
```

**지원 테이블:**

| 테이블 | 시트명 | 비고 |
|--------|--------|------|
| master | m_program, m_menuHead, m_menuBody, m_events, m_employees 등 | 마스터 전체 |
| customers | customers | 고객 목록 |
| sales | sales_YYYYMM | 월별 매출 |
| purchase | purchase | 매입 |
| attendance | attendance_YYYYMM | 월별 출퇴근 |
| salary | salary | 급여 |
| contracts | contracts | 계약서 |

---

### Phase 2 — 매출 (PAGE_ERP_SALES.html)

| 기능 | 상태 |
|------|------|
| 일별 매출 입력 (스프레드시트) | ✅ |
| 고객 자동완성 (CustomerAC) | ✅ |
| 담당자(therapist) 컬럼 | ✅ |
| 메뉴 선택 시 할인가 자동반영 | ✅ |
| 이벤트/할인 적용 (getActiveEvents) | ✅ |
| 메뉴 구성 팝업 (☰) | ✅ |
| 영수증 팝업 + 인쇄 (🧾) | ✅ |
| 매출 내역 / 일별 마감 탭 | ✅ |

---

### Phase 3 — 출퇴근 (PAGE_ERP_COMMUTE.html)

| 기능 | 상태 |
|------|------|
| 월별 달력 그리드 (직원×날짜) | ✅ |
| 셀 클릭 → 시간 입력 모달 | ✅ |
| 지문기 XLS 업로드 (SheetJS) | ✅ |
| 직원별 뷰 (4 통계 카드 + 일별 테이블) | ✅ |
| 월 통계 (출근일/지각/초과근무/예상급여) | ✅ |
| 지각 기준: 09:30 / 초과: 19:00 | ✅ |

---

### Phase 4 — 급여 (PAGE_ERP_MEMBER_SALARY.html)

| 기능 | 상태 |
|------|------|
| 4단계 워크플로우 (계산→검토→확정→지급) | ✅ |
| therapist 기반 팁 귀속 계산 | ✅ |
| 기본급 + 초과근무수당 + 팁 - 공제(3.5%) | ✅ |
| 급여 확정 저장 | ✅ |
| 지급처리 (지급일 기록) | ✅ |
| 급여명세서 팝업 + 인쇄 | ✅ |

---

### Phase 5 — 결산 (PAGE_ERP_CLOSING.html)

| 기능 | 상태 |
|------|------|
| 월말 / 분기 / 반기 / 년간 탭 | ✅ |
| 총매출 / 영업지출 / 매입비용 / 순이익 카드 | ✅ |
| 전년 대비 YoY | ✅ |
| 월별 매출 바 차트 | ✅ |
| 손익 내역 테이블 | ✅ |
| 매입 내역 테이블 | ✅ |

---

### Phase 6 — 마스터 / 대시보드 (PAGE_ERP_MASTER.html)

| 기능 | 상태 |
|------|------|
| 대시보드 (오늘 매출/출근/이벤트/최근고객) | ✅ |
| JSON 백업 ⬇ / 복원 ⬆ (BackupService) | ✅ |
| 프로그램 / 메뉴HEAD / 메뉴BODY 관리 | ✅ |
| 이벤트 / 직원 / 멤버등급 관리 | ✅ |
| 매입분류 / 공급처 관리 | ✅ |

---

## ERP 페이지 목록

| 파일 | 라인 | 상태 | 비고 |
|------|------|------|------|
| `PAGE_ERP_MASTER.html` | 461L | ✅ | 대시보드 포함 11탭 |
| `PAGE_ERP_CUSTOMER_MANAGEMENT.html` | 199L | ✅ | 고객등록 탭 추가됨 |
| `PAGE_ERP_SALES.html` | 474L | ✅ | therapist/이벤트/영수증 |
| `PAGE_ERP_PURCHASE.html` | ~220L | ✅ | **재작성** — 3 컴포넌트 완성 |
| `PAGE_ERP_CLOSING.html` | 260L | ✅ | 4기간 결산 |
| `PAGE_ERP_EMPLOYEE_CONTRACT.html` | 123L | ✅ | 목록/추가/만료 |
| `PAGE_ERP_COMMUTE.html` | 459L | ✅ | XLS 업로드 포함 |
| `PAGE_ERP_MEMBER_SALARY.html` | 388L | ✅ | 4단계 워크플로우 |
| `ERP_COMMON.js` | 521L | ✅ | 공통 DataService/CSS/MASTER |

---

## 버그 수정 이력

| 날짜 | 파일 | 버그 | 수정 |
|------|------|------|------|
| 2026-04-12 | `PAGE_ERP_PURCHASE.html` | 로컬 DataService 중복 정의 + 3개 컴포넌트 미구현 | 전면 재작성 |
| 2026-04-12 | `PAGE_ERP_CUSTOMER_MANAGEMENT.html` | `'고객 등록'` 탭 없음 (CustomerRegister 미연결) | SUB_TABS + renderContent 수정 |
| 2026-04-12 | `PAGE_ERP_EMPLOYEE_CONTRACT.html` | 출퇴근 컴포넌트 3개 dead code | 제거 |
| 2026-04-11 | `ERP_COMMON.js` | SUB_TABS 한글 깨짐 (`메뉴구성(BODY)`) | 수정 |

---

## 추가 설치 도구

| 도구 | 버전 | 용도 |
|------|------|------|
| Aider | 0.86.2 | CLI 코드 에이전트 (Git 연동) |
| OpenCode | 1.3.15 | CLI TUI 코드 에디터 |
| Goose | latest | CLI 에이전트 (쉘 실행 가능) |
| Gemini CLI | 0.37.1 | 클라우드 에이전트 (인증 필요) |
| Kilo Code | latest | VS Code 확장 (Ollama 연결 완료) |
| Void | 1.99.30044 | AI 코드에디터 (Ollama 설정 필요) |
| Cursor | 3.0.16 | AI 코드에디터 (계정 필요) |
| Antigravity | 1.22.2 | Google AI 에디터 (계정 필요) |

---

## 남은 작업

### 즉시 가능
- [ ] Gemini CLI Google 계정 인증: `gemini auth`
- [ ] Void: Settings → AI Provider → Ollama → `http://127.0.0.1:11434`
- [ ] Cursor: 계정 생성 후 로그인

### 사용자 직접 필요
- [ ] Google Sheets 생성 → Apps Script 배포 → `APPS_SCRIPT_URL` 입력

### 다음 Sprint
- [ ] `PAGE_ERP_CLOSING.html` — 엑셀 내보내기 버튼
- [ ] `PAGE_ERP_MEMBER_SALARY.html` — 급여명세서 print CSS 보완
- [ ] 전체 페이지 QA (Agent C — agent-qa :11436)
- [ ] ERP_COMMON.js MASTER 데이터 Apps Script 실시간 동기화 검증

---

## 참고: Ollama 모델 Modelfile 요약

### agent-coder (GPU 0)
- BASE: qwen3.5:9b-q4_K_M
- temperature: 0.7 / num_ctx: 16384
- SYSTEM: 프론트엔드 전문 개발자, 완전한 코드 작성

### agent-reviewer (GPU 1)
- BASE: qwen3.5:9b-q4_K_M
- temperature: 0.2 / num_ctx: 8192
- SYSTEM: 시니어 코드 리뷰어, 버그·오류 탐지

### agent-qa (GPU 2)
- BASE: qwen3.5:9b-q4_K_M
- temperature: 0.15 / num_ctx: 8192
- SYSTEM: QA 엔지니어, PASS/FAIL 구조화 출력
- 주의: GPU 2는 디스플레이 GPU — GPU+CPU 혼합 모드 (응답 느림)
