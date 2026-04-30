// ERP_COMMON.js — 공통 데이터, 서비스, CSS
// 모든 ERP 페이지에서 로드

/* ═══ MASTER DATA (마스터정보 — DB 연동 시 교체) ═══ */
const MAJOR_CATS = ['마사지','피부관리','피부시술'];
const TIME_OPTS = ['10분','15분','20분','30분','40분','45분','60분','90분','120분','150분'];
const MASTER = window._MASTER_DATA || {};
const getMASTER = () => DataService._store.master || window._MASTER_DATA || {};


// 헬퍼
const EMPLOYEES = (DataService._store.master?.employees||[]);
const MEMBER_GRADES = (DataService._store.master?.memberGrades||[]);
const EXPENSE_ITEMS = (DataService._store.master?.expenseItems||[]).filter(e=>e.active).map(e=>e.name);
const PURCHASE_CATS = (DataService._store.master?.purchaseCategories||[]).filter(c=>c.active).map(c=>c.name);
const MENU_NAMES = (DataService._store.master?.menuHead||[]).filter(m=>m.active).map(m=>m.name);
const SUPPLIER_NAMES = (DataService._store.master?.suppliers||[]).filter(s=>s.active).map(s=>s.name);
// 프로그램 코드→이름 매핑
const pgName = (code) => { const p = (DataService._store.master?.program||[]).find(x=>x.code===code); return p ? p.name : code; };

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
  master:['프로그램','메뉴(HEAD)','메뉴구성(BODY)','이벤트','직원','멤버등급','지출항목','매입분류','공급처','고객등록'],
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
   ════════════════════════════════════════
   APPS_SCRIPT_URL: Apps Script 웹앱 배포 후 URL 을 여기에 붙여넣으세요.
   빈 문자열이면 인메모리 목업 데이터로 동작합니다.
   ════════════════════════════════════════ */
const APPS_SCRIPT_URL = '';  // TODO: 'https://script.google.com/macros/s/YOUR_ID/exec'

const DataService = {
  _store: {
    master: null,          // DATA_CONNECTOR → master.json
    customers: [],         // DATA_CONNECTOR → customers.json
    charts: {},            // DATA_CONNECTOR → customer_charts_1/2.json
    sales: {},             // DATA_CONNECTOR → sales_2026_N.json (날짜별 맵)
    salesAllRecords: [],   // DATA_CONNECTOR → 전체 레코드 배열
    purchase: [],          // DATA_CONNECTOR → expenses_2026.json
    closing: [],           // DATA_CONNECTOR → closing_pl.json
    attendance: {},        // DATA_CONNECTOR → attendance_2026.json (향후)
    contracts: [],         // DATA_CONNECTOR → contracts.json
    salary: null,          // DATA_CONNECTOR → salary_2026_03.json
    salaryByMonth: {}      // DATA_CONNECTOR → 월별 급여 맵
  },
  // ── API 호출 (APPS_SCRIPT_URL 설정 시) ──────────────────────
  async _apiGet(table, month) {
    let url = APPS_SCRIPT_URL + '?table=' + table;
    if (month) url += '&month=' + month;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'API error');
    return json.data;
  },
  async _apiPost(table, data, month) {
    const body = { table, data };
    if (month) body.month = month;
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'API error');
    return json.data;
  },

  // ── read / write (API 우선, 실패 시 in-memory 폴백) ──────────
  async read(t, month) {
    if (APPS_SCRIPT_URL) {
      try {
        const data = await this._apiGet(t, month);
        this._store[t] = data;  // 캐시 업데이트
        return JSON.parse(JSON.stringify(data));
      } catch(err) {
        console.warn('[DataService] API read 실패, 목업 사용:', err.message);
      }
    }
    const raw = this._store[t];
    return JSON.parse(JSON.stringify(raw != null ? raw : (t === 'sales' || t === 'attendance' ? {} : [])));
  },
  async write(t, d, month) {
    if (APPS_SCRIPT_URL) {
      try {
        await this._apiPost(t, d, month);
      } catch(err) {
        console.warn('[DataService] API write 실패, 목업에만 저장:', err.message);
      }
    }
    this._store[t] = JSON.parse(JSON.stringify(d));
  },
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
.hdr-tab-wrap{position:relative;}
.hdr-dropdown{display:none;position:absolute;top:100%;left:0;min-width:140px;background:var(--bg-card);border:1px solid var(--border-gold);border-radius:var(--rs);box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:200;padding:4px 0;margin-top:2px;}
.hdr-tab-wrap:hover .hdr-dropdown{display:block;}
.hdr-dropdown-item{display:flex;align-items:center;gap:6px;padding:8px 14px;color:var(--text2);font-size:11px;font-weight:600;text-decoration:none;transition:all .15s;white-space:nowrap;}
.hdr-dropdown-item:hover{color:var(--gold-light);background:var(--gold-glow);}
.hdr-dropdown-item.active{color:var(--gold-light);}

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
  {id:'master', label:'마스터', href:'PAGE_ERP_MASTER.html', icon:'M12 15a3 3 0 100-6 3 3 0 000 6z', children:[{id:'menu', label:'메뉴관리', href:'PAGE_ERP_MENU.html', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2'},{id:'customer', label:'고객', href:'PAGE_ERP_CUSTOMER_MANAGEMENT.html', icon:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2 M12 11a4 4 0 100-8 4 4 0 000 8'},{id:'contract', label:'계약서', href:'PAGE_ERP_EMPLOYEE_CONTRACT.html', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8'},{id:'commute', label:'출퇴근', href:'PAGE_ERP_COMMUTE.html', icon:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2'},{id:'salary', label:'월급여', href:'PAGE_ERP_MEMBER_SALARY.html', icon:'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'}]},
  {id:'sales', label:'매출', href:'PAGE_ERP_SALES.html', icon:'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'},
  {id:'purchase', label:'매입', href:'PAGE_ERP_PURCHASE.html', icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0'},
  {id:'closing', label:'결산', href:'PAGE_ERP_CLOSING.html', icon:'M18 20V10 M12 20V4 M6 20v-6'},
  {id:'calendar', label:'캘린더', href:'PAGE_ERP_CALENDAR.html', icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'},
];

// 인증 체크
const getUser = () => {
  try { const s = localStorage.getItem("hskb_erp_user"); return s ? JSON.parse(s) : null; } catch { return null; }
};

/* ════════════════════════════════════════
   권한 관리 (Phase 6)
   ════════════════════════════════════════ */
const ROLE_MAP = {
  admin      : 'admin',    // 전체 접근
  galaxy0219 : 'director', // 원장: 매출/출퇴근/급여/결산
  manager    : 'manager',  // 매니저: 매출/출퇴근
};

// NAV_ITEMS ID 기준 (closing/contract/commute)
// ERP_PAGES ID 별칭 (settlement/contracts/attendance) 도 포함
const ROLE_MENUS = {
  admin    : ['master','customer','sales','purchase','closing','contract','commute','salary',
              'settlement','contracts','attendance'],
  director : ['sales','commute','salary','closing','settlement','attendance'],
  manager  : ['sales','commute','attendance'],
};

const AuthService = {
  // 현재 로그인 사용자의 role 반환
  getRole() {
    const objUser = getUser();
    if (!objUser) return null;
    return ROLE_MAP[objUser.id] || 'manager';
  },

  // 특정 메뉴 접근 가능 여부
  bCanAccess(strMenuId) {
    const strRole = this.getRole();
    if (!strRole) return false;
    return (ROLE_MENUS[strRole] || []).includes(strMenuId);
  },

  // 현재 페이지 접근 권한 체크 — 차단 시 메시지 표시 후 false 반환
  bCheckPageAccess(strMenuId) {
    if (!getUser()) { window.location.href = 'PAGE_ERP.html'; return false; }
    if (!this.bCanAccess(strMenuId)) {
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#B8956A;font-family:'Noto Sans KR',sans-serif;flex-direction:column;gap:16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B8956A" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h2 style="margin:0;font-size:18px;">접근 권한이 없습니다</h2>
          <p style="margin:0;color:#888;font-size:13px;">이 페이지는 ${this.getRole() === 'manager' ? '원장 이상' : '관리자'}만 접근 가능합니다.</p>
          <button onclick="history.back()" style="margin-top:8px;padding:8px 24px;background:#B8956A;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">돌아가기</button>
        </div>`;
      return false;
    }
    return true;
  },

  // 네비게이션에서 접근 불가 메뉴 숨김 처리용 필터
  lstFilteredNav(lstNavItems) {
    return lstNavItems.filter(item => this.bCanAccess(item.id));
  },
};

/* ════════════════════════════════════════
   BACKUP / RESTORE (Phase 6)
   ════════════════════════════════════════ */
const BackupService = {
  // 전체 데이터를 JSON 파일로 다운로드
  async exportAll() {
    const tables = ['master','customers','sales','purchase','attendance','salary','contracts'];
    const snapshot = { exportedAt: new Date().toISOString(), version: '1.0', data: {} };
    for (const t of tables) {
      snapshot.data[t] = await DataService.read(t);
    }
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `HSKB_ERP_backup_${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // JSON 파일에서 복원
  async importAll(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const snapshot = JSON.parse(e.target.result);
          if (!snapshot.data) throw new Error('유효하지 않은 백업 파일');
          const tables = Object.keys(snapshot.data);
          for (const t of tables) {
            await DataService.write(t, snapshot.data[t]);
          }
          resolve(tables.length);
        } catch(err) { reject(err); }
      };
      reader.readAsText(file, 'utf-8');
    });
  },
};
