// ERP_COMMON.js — 공통 데이터, 서비스, CSS
// 모든 ERP 페이지에서 로드

/* ═══ MASTER DATA (마스터정보 — DB 연동 시 교체) ═══ */
const MAJOR_CATS = ['마사지','피부관리','피부시술'];
const TIME_OPTS = ['10분','15분','20분','30분','40분','45분','60분','90분','120분','150분'];

const MASTER = {
  /* PROGRAM: 독립 프로그램 모듈 (재사용 가능 단위) */
  program: [
    { code:'PG001', name:'딥클렌징', majorCat:'피부관리', defaultTime:'20분', desc:'모공 딥클렌징', active:true },
    { code:'PG002', name:'기본 클렌징', majorCat:'피부관리', defaultTime:'20분', desc:'순한 기본 클렌징', active:true },
    { code:'PG003', name:'얼굴 마사지', majorCat:'마사지', defaultTime:'30분', desc:'페이셜 경락 마사지', active:true },
    { code:'PG004', name:'바디 경락 마사지', majorCat:'마사지', defaultTime:'60분', desc:'전신 경락 순환', active:true },
    { code:'PG005', name:'발 경락 마사지', majorCat:'마사지', defaultTime:'30분', desc:'발+종아리 경락', active:true },
    { code:'PG006', name:'발 각질정리', majorCat:'마사지', defaultTime:'30분', desc:'발 각질 제거+보습', active:true },
    { code:'PG007', name:'앰플 도포', majorCat:'피부관리', defaultTime:'10분', desc:'고농축 앰플 흡수', active:true },
    { code:'PG008', name:'모델링팩', majorCat:'피부관리', defaultTime:'30분', desc:'석고 모델링 마스크', active:true },
    { code:'PG009', name:'수분팩', majorCat:'피부관리', defaultTime:'20분', desc:'수분 집중 시트팩', active:true },
    { code:'PG010', name:'수분 집중 케어', majorCat:'피부관리', defaultTime:'30분', desc:'히알루론산 수분 관리', active:true },
    { code:'PG011', name:'재생 앰플', majorCat:'피부관리', defaultTime:'15분', desc:'EGF 재생 앰플', active:true },
    { code:'PG012', name:'진정 마무리', majorCat:'피부관리', defaultTime:'20분', desc:'시술 후 진정 케어', active:true },
    { code:'PG013', name:'HIFU 초음파', majorCat:'피부시술', defaultTime:'60분', desc:'하이푸 리프팅 시술', active:true },
    { code:'PG014', name:'RF 고주파 시술', majorCat:'피부시술', defaultTime:'40분', desc:'RF 탄력 리프팅', active:true },
    { code:'PG015', name:'플라즈마 시술', majorCat:'피부시술', defaultTime:'30분', desc:'플라즈마 재생 시술', active:true },
    { code:'PG016', name:'아쿠아필 딥클렌징', majorCat:'피부관리', defaultTime:'30분', desc:'아쿠아필 워터필링', active:true },
    { code:'PG017', name:'반영구 눈썹 시술', majorCat:'피부시술', defaultTime:'120분', desc:'반영구 문신 눈썹', active:true },
    { code:'PG018', name:'두피 스케일링', majorCat:'피부관리', defaultTime:'20분', desc:'두피 각질/노폐물 제거', active:true },
    { code:'PG019', name:'두피 영양 앰플', majorCat:'피부관리', defaultTime:'20분', desc:'두피 영양 집중 공급', active:true },
    { code:'PG020', name:'두피 LED', majorCat:'피부시술', defaultTime:'20분', desc:'LED 두피 치료', active:true },
    { code:'PG021', name:'전신 경락 마사지', majorCat:'마사지', defaultTime:'60분', desc:'전신 경락 순환 마사지', active:true },
  ],

  /* MENU_HEAD: 메뉴 (프로그램 집합체) */
  menuHead: [
    { code:'MH001', name:'화사케어 A', desc:'페이셜 풀코스 A', totalTime:90, price:880000, active:true },
    { code:'MH002', name:'화사케어 B', desc:'페이셜 코스 B', totalTime:70, price:660000, active:true },
    { code:'MH003', name:'화사케어 C', desc:'페이셜 기본 C', totalTime:50, price:440000, active:true },
    { code:'MH004', name:'골프케어 A', desc:'골프 후 바디+페이스 풀', totalTime:120, price:1320000, active:true },
    { code:'MH005', name:'골프케어 B', desc:'골프 후 바디+페이스', totalTime:100, price:1100000, active:true },
    { code:'MH006', name:'골프케어 C', desc:'골프 후 기본', totalTime:80, price:880000, active:true },
    { code:'MH007', name:'탈모케어', desc:'두피 스케일링+영양+LED', totalTime:60, price:1100000, active:true },
    { code:'MH008', name:'VIP케어', desc:'프리미엄 전신 코스', totalTime:150, price:1650000, active:true },
    { code:'MH009', name:'기본관리', desc:'기본 페이셜 클렌징+수분', totalTime:60, price:440000, active:true },
    { code:'MH010', name:'바디 마사지', desc:'전신 경락/아로마', totalTime:60, price:330000, active:true },
    { code:'MH011', name:'발 마사지', desc:'발+종아리 경락', totalTime:30, price:165000, active:true },
    { code:'MH012', name:'HIFU 리프팅', desc:'하이푸 초음파 리프팅', totalTime:90, price:2200000, active:true },
    { code:'MH013', name:'RF 고주파', desc:'고주파 리프팅+탄력', totalTime:60, price:1100000, active:true },
    { code:'MH014', name:'플라즈마', desc:'플라즈마 피부 재생', totalTime:45, price:880000, active:true },
    { code:'MH015', name:'아쿠아필링', desc:'아쿠아필 딥클렌징+수분', totalTime:60, price:550000, active:true },
    { code:'MH016', name:'반영구 눈썹', desc:'눈썹 반영구 시술', totalTime:120, price:3300000, active:true },
  ],

  /* MENU_BODY: 메뉴↔프로그램 매핑 (라우트) */
  menuBody: [
    { id:'MB001', menuCode:'MH001', pgCode:'PG001', time:'20분', seq:1, active:true },
    { id:'MB002', menuCode:'MH001', pgCode:'PG003', time:'30분', seq:2, active:true },
    { id:'MB003', menuCode:'MH001', pgCode:'PG007', time:'10분', seq:3, active:true },
    { id:'MB004', menuCode:'MH001', pgCode:'PG008', time:'30분', seq:4, active:true },
    { id:'MB005', menuCode:'MH002', pgCode:'PG001', time:'20분', seq:1, active:true },
    { id:'MB006', menuCode:'MH002', pgCode:'PG003', time:'30분', seq:2, active:true },
    { id:'MB007', menuCode:'MH002', pgCode:'PG009', time:'20분', seq:3, active:true },
    { id:'MB008', menuCode:'MH003', pgCode:'PG002', time:'20분', seq:1, active:true },
    { id:'MB009', menuCode:'MH003', pgCode:'PG009', time:'30분', seq:2, active:true },
    { id:'MB010', menuCode:'MH004', pgCode:'PG004', time:'60분', seq:1, active:true },
    { id:'MB011', menuCode:'MH004', pgCode:'PG003', time:'30분', seq:2, active:true },
    { id:'MB012', menuCode:'MH004', pgCode:'PG006', time:'30분', seq:3, active:true },
    { id:'MB013', menuCode:'MH010', pgCode:'PG021', time:'60분', seq:1, active:true },
    { id:'MB014', menuCode:'MH011', pgCode:'PG005', time:'30분', seq:1, active:true },
    { id:'MB015', menuCode:'MH012', pgCode:'PG013', time:'60분', seq:1, active:true },
    { id:'MB016', menuCode:'MH012', pgCode:'PG012', time:'30분', seq:2, active:true },
    { id:'MB017', menuCode:'MH013', pgCode:'PG014', time:'40분', seq:1, active:true },
    { id:'MB018', menuCode:'MH013', pgCode:'PG012', time:'20분', seq:2, active:true },
    { id:'MB019', menuCode:'MH014', pgCode:'PG015', time:'30분', seq:1, active:true },
    { id:'MB020', menuCode:'MH014', pgCode:'PG011', time:'15분', seq:2, active:true },
    { id:'MB021', menuCode:'MH015', pgCode:'PG016', time:'30분', seq:1, active:true },
    { id:'MB022', menuCode:'MH015', pgCode:'PG010', time:'30분', seq:2, active:true },
    { id:'MB023', menuCode:'MH016', pgCode:'PG017', time:'120분', seq:1, active:true },
    { id:'MB024', menuCode:'MH007', pgCode:'PG018', time:'20분', seq:1, active:true },
    { id:'MB025', menuCode:'MH007', pgCode:'PG019', time:'20분', seq:2, active:true },
    { id:'MB026', menuCode:'MH007', pgCode:'PG020', time:'20분', seq:3, active:true },
  ],

  /* EVENTS */
  events: [
    { id:'EV001', name:'오픈 기념 10% 할인', menuCode:'', startDate:'2026-03-01', endDate:'2026-04-30', discountType:'%', discountValue:10, desc:'전 메뉴 10% 할인', active:true },
    { id:'EV002', name:'골프케어 패키지 특가', menuCode:'MH004', startDate:'2026-04-01', endDate:'2026-06-30', discountType:'amt', discountValue:200000, desc:'골프케어 A 20만동 할인', active:true },
    { id:'EV003', name:'첫 방문 고객 15% 할인', menuCode:'', startDate:'2026-01-01', endDate:'2026-12-31', discountType:'%', discountValue:15, desc:'첫 방문 고객 전 메뉴', active:true },
    { id:'EV004', name:'VIP 회원 바디마사지 무료', menuCode:'MH010', startDate:'2026-04-01', endDate:'2026-04-30', discountType:'%', discountValue:100, desc:'VVIP 회원 대상', active:false },
  ],

  employees: [
    { id:1, name:'hong', nameKr:'홍', position:'수석 관리사', base:8000000, hourly:35000, active:true },
    { id:2, name:'thuy', nameKr:'투이', position:'데스크 매니저', base:6500000, hourly:29000, active:true },
    { id:3, name:'yen', nameKr:'옌', position:'관리사', base:7500000, hourly:33000, active:true },
  ],
  memberGrades: ['','CLUB','BRONZE','SILVER','GOLD','VIP','VVIP','이밴트','무제한'],
  expenseItems: [
    { id:'ex01', name:'빨래', active:true },{ id:'ex02', name:'택배', active:true },{ id:'ex03', name:'직원팁', active:true },
    { id:'ex04', name:'쿠폰', active:true },{ id:'ex05', name:'마트', active:true },{ id:'ex06', name:'청소', active:true },
    { id:'ex07', name:'소모품', active:true },{ id:'ex08', name:'기타', active:true },
  ],
  purchaseCategories: [
    { id:'pc01', name:'원재료', active:true },{ id:'pc02', name:'소모품', active:true },
    { id:'pc03', name:'장비', active:true },{ id:'pc04', name:'기타', active:true },
  ],
  suppliers: [
    { id:'sp01', name:'화장품 도매', contact:'', active:true },{ id:'sp02', name:'포장재 업체', contact:'', active:true },
    { id:'sp03', name:'의료기기 대리점', contact:'', active:true },{ id:'sp04', name:'약품 도매', contact:'', active:true },
  ],
};

// 헬퍼
const EMPLOYEES = MASTER.employees;
const MEMBER_GRADES = MASTER.memberGrades;
const EXPENSE_ITEMS = MASTER.expenseItems.filter(e=>e.active).map(e=>e.name);
const PURCHASE_CATS = MASTER.purchaseCategories.filter(c=>c.active).map(c=>c.name);
const MENU_NAMES = MASTER.menuHead.filter(m=>m.active).map(m=>m.name);
const SUPPLIER_NAMES = MASTER.suppliers.filter(s=>s.active).map(s=>s.name);
// 프로그램 코드→이름 매핑
const pgName = (code) => { const p = MASTER.program.find(x=>x.code===code); return p ? p.name : code; };

const MENUS = [
  { id:'master', label:'마스터', icon:'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06' },
  { id:'customer', label:'고객', icon:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2 M12 11a4 4 0 100-8 4 4 0 000 8' },
  { id:'sales', label:'매출', icon:'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { id:'purchase', label:'매입', icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0' },
  { id:'settlement', label:'결산', icon:'M18 20V10 M12 20V4 M6 20v-6' },
  { id:'contracts', label:'계약서', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
  { id:'attendance', label:'출퇴근', icon:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2' },
  { id:'salary', label:'월급여', icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2 M12 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87' },
];
const SUB_TABS = {
  master:['프로그램','메뉴(HEAD)','��뉴구성(BODY)','이벤트','직원','멤버등급','지출항목','매입분류','공급처','고객등록'],
  customer:['고객 목록','고객 상세'],
  sales:['일일 입력','매출 내역','월별 요약'],
  purchase:['매입 입력','매입 내역','통계'],
  settlement:['월말','분기','반기','년간'],
  contracts:['계약서 목록','추가','만료 내역'],
  attendance:['월별 현황','직원별','근태 요약'],
  salary:['급여 계산','지급 이력','명세서'],
};

/* ════════════════════════════════════════
   DATA SERVICE
   ════════════════════════════════════════ */
const DataService = {
  _store: {
    master: MASTER,
    customers: [
      { id:'C001', name:'김민준', nameEn:'', phone:'0912-345-6789', gender:'남', birth:'1994-05-12', grade:'GOLD', firstVisit:'2025-08-15', area:'미딩', memo:'탈모 관심', mileage:125000,
        payments:[
          {date:'2026-03-02',menu:'화사케어 A',amount:880000,method:'현금',tip:100000},
          {date:'2026-03-15',menu:'탈모케어',amount:1100000,method:'카드',tip:100000},
          {date:'2026-04-01',menu:'화사케어 B',amount:660000,method:'현금',tip:100000},
        ],
        history:[
          {date:'2026-03-02',menu:'화사케어 A',therapist:'홍',note:'첫 방문, 복합성 피부'},
          {date:'2026-03-15',menu:'탈모케어',therapist:'홍',note:'두피 상태 양호'},
          {date:'2026-04-01',menu:'화사케어 B',therapist:'옌',note:'색소 개선 중'},
        ]},
      { id:'C002', name:'Nguyễn Mai', nameEn:'Nguyen Mai', phone:'0987-654-3210', gender:'여', birth:'1990-11-03', grade:'VIP', firstVisit:'2025-06-01', area:'꺼우저이', memo:'정기 관리 고객', mileage:350000,
        payments:[
          {date:'2026-02-20',menu:'VIP케어',amount:1650000,method:'카드',tip:100000},
          {date:'2026-03-10',menu:'HIFU 리프팅',amount:2200000,method:'카드',tip:100000},
          {date:'2026-03-28',menu:'화사케어 A',amount:880000,method:'현금',tip:100000},
          {date:'2026-04-05',menu:'VIP케어',amount:1650000,method:'카드',tip:100000},
        ],
        history:[
          {date:'2026-02-20',menu:'VIP케어',therapist:'홍',note:'전신 관리, 만족'},
          {date:'2026-03-10',menu:'HIFU 리프팅',therapist:'홍',note:'리프팅 1회차'},
          {date:'2026-03-28',menu:'화사케어 A',therapist:'투이',note:'수분 부족'},
          {date:'2026-04-05',menu:'VIP케어',therapist:'홍',note:'리프팅 후 관리'},
        ]},
      { id:'C003', name:'박서연', nameEn:'', phone:'0968-111-2222', gender:'여', birth:'1988-02-28', grade:'CLUB', firstVisit:'2026-01-10', area:'동다', memo:'', mileage:55000,
        payments:[
          {date:'2026-01-10',menu:'기본관리',amount:440000,method:'현금',tip:100000},
          {date:'2026-02-14',menu:'아쿠아필링',amount:550000,method:'카드',tip:100000},
        ],
        history:[
          {date:'2026-01-10',menu:'기본관리',therapist:'옌',note:'첫 방문'},
          {date:'2026-02-14',menu:'아쿠아필링',therapist:'옌',note:'모공 관리 시작'},
        ]},
      { id:'C004', name:'Trần Hùng', nameEn:'Tran Hung', phone:'0945-333-4444', gender:'남', birth:'1985-07-20', grade:'', firstVisit:'2026-03-20', area:'미딩', memo:'골프 후 관리', mileage:0,
        payments:[
          {date:'2026-03-20',menu:'골프케어 A',amount:1320000,method:'카드',tip:100000},
        ],
        history:[
          {date:'2026-03-20',menu:'골프케어 A',therapist:'홍',note:'골프 후 바디+페이스'},
        ]},
      { id:'C005', name:'이수진', nameEn:'', phone:'0932-555-6666', gender:'여', birth:'1992-09-15', grade:'BRONZE', firstVisit:'2025-11-05', area:'떠이호', memo:'민감성 피부 주의', mileage:88000,
        payments:[
          {date:'2025-11-05',menu:'기본관리',amount:440000,method:'현금',tip:100000},
          {date:'2025-12-10',menu:'화사케어 C',amount:440000,method:'현금',tip:100000},
          {date:'2026-01-20',menu:'화사케어 B',amount:660000,method:'카드',tip:100000},
          {date:'2026-03-05',menu:'RF 고주파',amount:1100000,method:'카드',tip:100000},
        ],
        history:[
          {date:'2025-11-05',menu:'기본관리',therapist:'옌',note:'첫 방문, 민감성'},
          {date:'2025-12-10',menu:'화사케어 C',therapist:'옌',note:'자극 없이 진행'},
          {date:'2026-01-20',menu:'화사케어 B',therapist:'투이',note:'피부결 개선'},
          {date:'2026-03-05',menu:'RF 고주파',therapist:'홍',note:'탄력 개선 시작'},
        ]},
    ],
    sales: {},
    purchase: [
      { id:'p001', date:'2026-03-05', supplier:'화장품 도매', item:'앰플 세트', category:'원재료', qty:5, unitPrice:4000000, total:20000000, note:'' },
      { id:'p002', date:'2026-03-08', supplier:'포장재 업체', item:'포장박스', category:'소모품', qty:100, unitPrice:50000, total:5000000, note:'' },
      { id:'p003', date:'2026-03-10', supplier:'의료기기', item:'LED 필터', category:'장비', qty:3, unitPrice:850000, total:2550000, note:'' },
      { id:'p004', date:'2026-03-12', supplier:'약품 도매', item:'두피 세럼', category:'원재료', qty:20, unitPrice:250000, total:5000000, note:'' },
    ],
    attendance: { '2026-03': { hong:{1:{in:'09:18',out:'19:37'},2:{in:'08:53',out:'19:33'},3:{in:'09:05',out:'19:45'},4:{in:'09:10',out:'19:30'},5:{in:'09:00',out:'19:40'}}, thuy:{1:{in:'08:50',out:'18:05'},2:{in:'09:02',out:'18:10'},3:{in:'08:55',out:'18:00'},4:{in:'09:15',out:'18:20'}}, yen:{1:{in:'09:00',out:'19:30'},2:{in:'08:58',out:'19:35'},3:{in:'09:10',out:'19:25'}} } },
    contracts: [
      { id:'c001', employee:'hong', type:'정규직', position:'수석 관리사', start:'2025-01-01', end:'2025-12-31', baseSalary:8000000, hourlyRate:35000, note:'', status:'유효' },
      { id:'c002', employee:'thuy', type:'정규직', position:'데스크 매니저', start:'2025-03-01', end:'2026-02-28', baseSalary:6500000, hourlyRate:29000, note:'', status:'유효' },
      { id:'c003', employee:'yen', type:'정규직', position:'관리사', start:'2025-06-01', end:'2026-05-31', baseSalary:7500000, hourlyRate:33000, note:'', status:'유효' },
    ],
    salary: [
      { id:'s001', employee:'hong', year:2026, month:2, workDays:24, workHours:248, baseSalary:8000000, overtime:200000, tip:1800000, deduction:280000, netSalary:9720000, paid:true, paidDate:'2026-03-05' },
      { id:'s002', employee:'thuy', year:2026, month:2, workDays:24, workHours:220, baseSalary:6500000, overtime:0, tip:950000, deduction:220000, netSalary:7230000, paid:true, paidDate:'2026-03-05' },
      { id:'s003', employee:'yen', year:2026, month:2, workDays:22, workHours:228, baseSalary:7500000, overtime:150000, tip:1500000, deduction:260000, netSalary:8890000, paid:true, paidDate:'2026-03-05' },
    ],
  },
  async read(t) { return JSON.parse(JSON.stringify(this._store[t] || (Array.isArray(this._store[t]) ? [] : {}))); },
  async write(t, d) { this._store[t] = JSON.parse(JSON.stringify(d)); },
};

// Mock sales
(() => {
  const names=['김민준','Nguyễn Mai','박서연','Trần Hùng','이수진','Lê Hoa','Phạm Tuấn','정하늘','Đỗ Lan','최예린'];
  const progs=['화사케어 A','화사케어 B','화사케어 C','골프케어 A','골프케어 B','탈모케어','VIP케어','기본관리'];
  const s={};
  for(let d=2;d<=15;d++){
    const dt=`2026-03-${String(d).padStart(2,'0')}`;
    const rows=[];const cnt=5+Math.floor(Math.random()*8);
    for(let i=0;i<cnt;i++){
      const cash=Math.round((Math.random()*800000+200000)/10000)*10000;
      const card=Math.random()>0.6?Math.round(Math.random()*500000/10000)*10000:0;
      const tipD=Math.random()>0.5?Math.round(Math.random()*200000/10000)*10000:0;
      rows.push({no:i+1,date:dt,name:names[i%names.length],grade:MEMBER_GRADES[Math.floor(Math.random()*MEMBER_GRADES.length)],service:progs[Math.floor(Math.random()*progs.length)],hair:Math.random()>0.8,event:Math.random()>0.85,vip:Math.random()>0.9,deductAmt:0,deduct:0,tipDeduct:tipD,cash,deposit:0,card,krw:Math.random()>0.8?50000:0,unpaid:0,male:Math.random()>0.5?'M':'',female:Math.random()>0.5?'F':'',ticket:''});
    }
    const exps=[];
    if(Math.random()>0.3) exps.push({item:'빨래',amount:150000,note:''});
    if(Math.random()>0.5) exps.push({item:'마트',amount:Math.round(Math.random()*300000/10000)*10000,note:''});
    s[dt]={rows,expenses:exps};
  }
  DataService._store.sales=s;
})();

/* ════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════ */
const pad2=(n)=>String(n).padStart(2,'0');
const fmt=(n)=>n==null||n===''?'':Number(n).toLocaleString('ko-KR');
const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;};

const darkVars = `
  --gold:#B8956A;--gold-light:#D4B896;--gold-dark:#8B6F4E;--gold-glow:rgba(184,149,106,0.15);
  --bg:#0D0D0F;--bg2:#141418;--bg-card:#1A1A1F;--bg-el:#222228;
  --border:rgba(255,255,255,0.06);--border-gold:rgba(184,149,106,0.2);
  --text:#F0ECE6;--text2:#9B9B9B;--text3:#5E5E5E;
  --ok:#6BCB77;--warn:#FFB347;--err:#FF6B6B;--info:#4D96FF;
  --ss-focus:rgba(184,149,106,0.08);--ss-hover:rgba(255,255,255,0.015);
`;
const lightVars = `
  --gold:#9E7B55;--gold-light:#7A5F3E;--gold-dark:#5C4530;--gold-glow:rgba(158,123,85,0.1);
  --bg:#F4F2EF;--bg2:#FFFFFF;--bg-card:#FFFFFF;--bg-el:#F0EDE8;
  --border:rgba(0,0,0,0.08);--border-gold:rgba(158,123,85,0.2);
  --text:#1A1816;--text2:#6B6560;--text3:#9E9589;
  --ok:#2E8B3E;--warn:#C87D1A;--err:#D04040;--info:#2766CC;
  --ss-focus:rgba(158,123,85,0.08);--ss-hover:rgba(0,0,0,0.015);
`;

const CSS = `
:root { ${darkVars} --hdr-h:52px;--radius:10px;--rs:6px; }
body.light { ${lightVars} }
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Instrument Sans','Noto Sans KR',sans-serif;background:var(--bg);color:var(--text);overflow:hidden;transition:background .3s,color .3s;font-size:12px;letter-spacing:0.2px;}
.app{display:flex;flex-direction:column;height:100vh;width:100vw;}

/* HEADER */
.hdr{height:var(--hdr-h);background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 16px;gap:0;flex-shrink:0;z-index:100;transition:background .3s;}
.hdr-logo{display:flex;align-items:center;gap:8px;margin-right:20px;cursor:default;}
.hdr-logo .mk{width:28px;height:28px;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:#fff;}
.hdr-logo .nm{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--gold-light);letter-spacing:0.5px;}
.hdr-nav{display:flex;gap:1px;flex:1;}
.hdr-tab{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:var(--rs);cursor:pointer;transition:all .2s;color:var(--text2);font-family:'Instrument Sans','Noto Sans KR',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.5px;position:relative;}
.hdr-tab:hover{color:var(--text);background:var(--ss-hover);}
.hdr-tab.active{color:var(--gold-light);background:var(--gold-glow);}
.hdr-tab.active::after{content:'';position:absolute;bottom:-1px;left:13px;right:13px;height:2px;background:var(--gold);border-radius:1px;}
.hdr-right{display:flex;align-items:center;gap:10px;margin-left:auto;}
.hdr-date{font-size:10px;color:var(--text3);}
.hdr-user{display:flex;align-items:center;gap:7px;padding:3px 8px;border-radius:var(--rs);cursor:default;}
.hdr-user .av{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;}
.hdr-user .nm{font-size:11px;font-weight:500;}
.hdr-user .rl{font-size:9px;color:var(--text3);}
.btn-logout{background:none;border:1px solid var(--border);color:var(--text2);padding:4px 9px;border-radius:var(--rs);font-size:10px;cursor:pointer;font-family:inherit;transition:all .2s;}
.btn-logout:hover{border-color:var(--err);color:var(--err);}

/* THEME TOGGLE */
.theme-btn{width:32px;height:32px;border-radius:50%;border:1px solid var(--border);background:var(--bg-card);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;color:var(--text2);}
.theme-btn:hover{border-color:var(--gold);color:var(--gold);}

/* CONTENT */
.content{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.sub-tabs{display:flex;gap:1px;padding:8px 16px 0;background:var(--bg2);border-bottom:1px solid var(--border);transition:background .3s;}
.sub-tab{padding:7px 14px;font-family:'Instrument Sans','Noto Sans KR',sans-serif;font-size:10.5px;font-weight:600;letter-spacing:0.3px;color:var(--text2);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;}
.sub-tab:hover{color:var(--text);}
.sub-tab.active{color:var(--gold-light);border-bottom-color:var(--gold);}
.page{flex:1;overflow-y:auto;padding:16px;}
.page::-webkit-scrollbar{width:5px;}
.page::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}

/* PANEL */
.pn{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px;transition:background .3s,border-color .3s;}
.pn-h{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);}
.pn-t{font-size:13px;font-weight:600;}
.pn-st{font-size:10px;color:var(--text3);margin-top:1px;}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:9.5px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.3px;text-align:left;padding:7px 10px;background:var(--bg-el);border-bottom:1px solid var(--border);white-space:nowrap;position:sticky;top:0;z-index:5;}
.tbl td{padding:6px 10px;border-bottom:1px solid var(--border);font-size:11.5px;vertical-align:middle;white-space:nowrap;}
.tbl tr:hover td{background:var(--ss-hover);}
.tbl .num{text-align:right;font-variant-numeric:tabular-nums;}

/* SPREADSHEET */
.ss-wrap{overflow:auto;max-height:calc(100vh - 210px);border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-card);transition:background .3s;}
.ss{border-collapse:collapse;font-size:11px;}
.ss th{background:var(--bg-el);color:var(--text2);font-size:9px;font-weight:600;letter-spacing:0.3px;padding:5px 6px;border:1px solid var(--border);position:sticky;top:0;z-index:10;white-space:nowrap;text-align:center;transition:background .3s;}
.ss td{padding:0;border:1px solid var(--border);height:28px;}
.ss input,.ss select{width:100%;height:100%;background:transparent;border:none;outline:none;color:var(--text);font-size:10.5px;padding:3px 5px;font-family:inherit;}
.ss input:focus,.ss select:focus{background:var(--ss-focus);box-shadow:inset 0 0 0 1.5px var(--gold);}
.ss input[type=checkbox]{width:15px;height:15px;accent-color:var(--gold);cursor:pointer;}
.ss select{cursor:pointer;}
.ss select option{background:var(--bg-card);color:var(--text);}
.ss .rn{background:var(--bg-el);color:var(--text3);text-align:center;font-size:9px;width:30px;padding:3px;user-select:none;}
.ss .nc input{text-align:right;}
.ss-total{background:var(--gold-glow);}
.ss-total td{font-weight:600;padding:5px 6px;font-size:10.5px;color:var(--gold-light);}
.ss .del-btn{background:none;border:none;color:var(--err);cursor:pointer;font-size:13px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.ss .del-btn:hover{background:rgba(255,107,107,0.08);}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:var(--rs);font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;border:none;font-family:inherit;}
.btn-g{background:var(--gold);color:#fff;}.btn-g:hover{background:var(--gold-dark);}
.btn-o{background:none;border:1px solid var(--border-gold);color:var(--gold-light);}.btn-o:hover{background:var(--gold-glow);}
.btn-s{background:none;border:1px solid var(--border);color:var(--text2);}.btn-s:hover{background:var(--ss-hover);color:var(--text);}

/* FORM */
.form-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-bottom:14px;}
.form-g{display:flex;flex-direction:column;gap:3px;}
.form-l{font-size:9.5px;color:var(--text2);font-weight:600;letter-spacing:0.5px;}
.form-inp{background:var(--bg-el);border:1px solid var(--border);border-radius:var(--rs);padding:7px 9px;font-size:11.5px;color:var(--text);font-family:inherit;outline:none;transition:all .2s;}
.form-inp:focus{border-color:var(--border-gold);box-shadow:0 0 0 3px var(--gold-glow);}

/* CARDS */
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:14px;}
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px;transition:all .2s;position:relative;overflow:hidden;}
.card:hover{border-color:var(--border-gold);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.15);}
.card-bar{position:absolute;top:0;left:0;right:0;height:2px;}
.card-lb{font-size:9.5px;color:var(--text2);margin-bottom:5px;}
.card-vl{font-size:20px;font-weight:700;letter-spacing:-0.5px;}
.card-sub{font-size:9.5px;color:var(--text3);margin-top:3px;}

/* STATUS */
.sts{font-size:9px;font-weight:600;padding:2px 7px;border-radius:8px;}
.sts-ok{background:rgba(107,203,119,0.12);color:var(--ok);}
.sts-warn{background:rgba(255,179,71,0.12);color:var(--warn);}
.sts-err{background:rgba(255,107,107,0.12);color:var(--err);}
.sts-info{background:rgba(77,150,255,0.12);color:var(--info);}

/* EXPENSE */
.exp-panel{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-top:10px;transition:background .3s;}
.exp-panel h4{font-size:11px;color:var(--gold-light);margin-bottom:8px;}
.exp-row{display:flex;gap:6px;align-items:center;margin-bottom:5px;}
.exp-row select,.exp-row input{background:var(--bg-el);border:1px solid var(--border);border-radius:var(--rs);padding:4px 7px;font-size:10.5px;color:var(--text);font-family:inherit;outline:none;}
.exp-row select{width:90px;}.exp-row input{flex:1;}

/* CLOSE */
.close-panel{background:var(--gold-glow);border:1px solid var(--border-gold);border-radius:var(--radius);padding:14px;margin-top:10px;}
.close-panel h4{font-size:11px;color:var(--gold-light);margin-bottom:10px;}
.close-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;}
.close-item{display:flex;justify-content:space-between;padding:5px 8px;background:var(--bg-card);border-radius:var(--rs);border:1px solid var(--border);}
.close-item .k{font-size:9.5px;color:var(--text2);}
.close-item .v{font-size:11px;font-weight:600;color:var(--gold-light);font-variant-numeric:tabular-nums;}

/* ATTENDANCE */
.att-cal{border-collapse:collapse;font-size:9.5px;width:100%;}
.att-cal th{background:var(--bg-el);padding:5px 3px;border:1px solid var(--border);text-align:center;color:var(--text2);font-weight:600;position:sticky;top:0;z-index:5;}
.att-cal td{padding:2px;border:1px solid var(--border);text-align:center;font-variant-numeric:tabular-nums;height:26px;}
.att-cal .emp-name{background:var(--bg-el);font-weight:600;color:var(--gold-light);text-align:left;padding-left:6px;white-space:nowrap;position:sticky;left:0;z-index:3;}
.att-cal .in-t{color:var(--ok);font-size:8.5px;}
.att-cal .out-t{color:var(--info);font-size:8.5px;}

/* PAYSLIP */
.payslip{background:var(--bg-card);border:1px solid var(--border-gold);border-radius:var(--radius);padding:20px;max-width:480px;transition:background .3s;}
.payslip h3{font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--gold-light);margin-bottom:3px;}
.payslip .period{font-size:10px;color:var(--text3);margin-bottom:14px;}
.payslip .row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:11.5px;}
.payslip .row:last-child{border-bottom:none;}
.payslip .row .k{color:var(--text2);}
.payslip .row .v{font-weight:500;font-variant-numeric:tabular-nums;}
.payslip .total{border-top:2px solid var(--gold);margin-top:6px;padding-top:8px;}
.payslip .total .v{font-size:15px;font-weight:700;color:var(--gold-light);}

.fade-in{animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.toolbar{display:flex;align-items:center;gap:7px;margin-bottom:10px;flex-wrap:wrap;}
.toolbar .spacer{flex:1;}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:var(--text3);font-size:12px;}
`;

// Ic 컴포넌트 (non-JSX 버전)
const Ic=({d,size=18,color='currentColor'})=>React.createElement('svg',{width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:color,strokeWidth:'1.8',strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:d}));

// ERP 메뉴 정보 (페이지 네비게이션용)
const ERP_PAGES = [
  {id:'master', label:'마스터', href:'PAGE_ERP_MASTER.html', icon:'M12 15a3 3 0 100-6 3 3 0 000 6z'},
  {id:'customer', label:'고객', href:'PAGE_ERP_CUSTOMER_MANAGEMENT.html', icon:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2 M12 11a4 4 0 100-8 4 4 0 000 8'},
  {id:'sales', label:'매출', href:'PAGE_ERP_SALES.html', icon:'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'},
  {id:'purchase', label:'매입', href:'PAGE_ERP_PURCHASE.html', icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0'},
  {id:'closing', label:'결산', href:'PAGE_ERP_CLOSING.html', icon:'M18 20V10 M12 20V4 M6 20v-6'},
  {id:'contract', label:'계약서', href:'PAGE_ERP_EMPLOYEE_CONTRACT.html', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8'},
  {id:'commute', label:'출퇴근', href:'PAGE_ERP_COMMUTE.html', icon:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2'},
  {id:'salary', label:'월급여', href:'PAGE_ERP_MEMBER_SALARY.html', icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2 M12 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87'},
];

// 인증 체크
const getUser = () => {
  try { const s = sessionStorage.getItem("hskb_erp_user"); return s ? JSON.parse(s) : null; } catch { return null; }
};
