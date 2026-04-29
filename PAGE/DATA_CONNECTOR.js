/**
 * HSKB ERP Data Connector v2
 * GitHub Pages + GitHub REST API 기반 데이터 연동
 * DataService._store에 실제 데이터 자동 주입
 */

const HSKB_DATA = {
  _owner: 'man0913AI', _repo: 'HwasaKBeauty', _branch: 'main', _dataPath: 'data',
  _token: null, _cache: {},

  init() {
    this._token = localStorage.getItem('hskb_gh_token') || null;
    // 페이지 로드 후 DataService에 실제 데이터 자동 주입
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._autoSync());
    } else {
      setTimeout(() => this._autoSync(), 500);
    }
    return this;
  },

  // GitHub에서 실제 데이터를 DataService에 자동 주입
  async _autoSync() {
    try {
      const BASE = 'https://raw.githubusercontent.com/' + this._owner + '/' + this._repo + '/main/' + this._dataPath;
      const t = Date.now();

      // 고객 데이터 주입
      const cResp = await fetch(BASE + '/customers.json?t=' + t);
      if (cResp.ok) {
        const customers = await cResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.customers = customers;
          console.log('[HSKB] 고객 ' + customers.length + '명 DataService 주입 완료');
          window.dispatchEvent(new CustomEvent('hskb:customers:loaded', { detail: { customers } }));
        }
      }

      // 매출 데이터 주입
      const s1 = await fetch(BASE + '/sales_2026_1.json?t=' + t);
      const s2 = await fetch(BASE + '/sales_2026_2.json?t=' + t);
      if (s1.ok && s2.ok) {
        const sales1 = await s1.json();
        const sales2 = await s2.json();
        const allSales = [...sales1, ...sales2];
        if (typeof DataService !== 'undefined') {
          // 날짜별 맵 구조로 변환 (SalesList 컴포넌트가 {날짜:{rows:[],expenses:[]}} 구조 기대)
          const salesMap = {};
          allSales.forEach(s => {
            const dt = s.date || '';
            if(!dt) return;
            if(!salesMap[dt]) salesMap[dt] = { rows: [], expenses: [] };
            salesMap[dt].rows.push({
              no: salesMap[dt].rows.length + 1,
              name: s.customerName || '',
              member: s.memberGrade || '',
              assignee: '',
              menu: s.program || '',
              hairLoss: s.hairLoss || false,
              event: s.isEvent || false,
              vip: s.isVIP || false,
              deductAmt: s.deductAmount || 0,
              deduct: s.deductCount || 0,
              tipDeduct: s.tipDeduct || 0,
              cash: s.cash || 0,
              cashPlus: s.cashPlus10 || 0,
              card: s.card || 0,
              krw: s.krw || 0,
              unpaid: s.unpaid || 0,
              male: s.isMale || false,
              female: s.isFemale || false,
              ticket: s.ticket || ''
            });
          });
          DataService._store.sales = salesMap;
          DataService._store.salesAllRecords = allSales;
          const salesByMonth = {};
          allSales.forEach(s => { const m = s.month||''; if(!salesByMonth[m]) salesByMonth[m]=[]; salesByMonth[m].push(s); });
          DataService._store.salesByMonth = salesByMonth;
          console.log('[HSKB] 매출 ' + allSales.length + '건 DataService 주입 완료');
          window.dispatchEvent(new CustomEvent('hskb:sales:loaded', { detail: { sales: allSales } }));
        }
        this._cache['sales'] = allSales;
      }

      // 지출 데이터 주입
      const eResp = await fetch(BASE + '/expenses_2026.json?t=' + t);
      if (eResp.ok) {
        const expenses = await eResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.purchase = expenses;
          console.log('[HSKB] 지출 ' + expenses.length + '건 DataService 주입 완료');
          window.dispatchEvent(new CustomEvent('hskb:expenses:loaded', { detail: { expenses } }));
        }
        this._cache['expenses'] = expenses;
      }

      console.log('[HSKB] 자동 동기화 완료');
    } catch(e) {
      console.warn('[HSKB] 자동 동기화 실패:', e.message);
    }
  },

  _apiUrl(f) { return 'https://api.github.com/repos/' + this._owner + '/' + this._repo + '/contents/' + this._dataPath + '/' + f; },

  async _get(filename) {
    if (this._cache[filename]) return this._cache[filename];
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this._apiUrl(filename));
      if (this._token) xhr.setRequestHeader('Authorization', 'token ' + this._token);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const raw = atob(data.content.replace(/\n/g,''));
          const bytes = new Uint8Array(raw.length);
          for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
          const parsed = JSON.parse(new TextDecoder('utf-8').decode(bytes));
          this._cache[filename] = { data: parsed, sha: data.sha };
          resolve(this._cache[filename]);
        } else reject(new Error('HTTP ' + xhr.status));
      };
      xhr.onerror = () => reject(new Error('XHR Error'));
      xhr.send();
    });
  },

  async _put(filename, jsonData, existingSha) {
    const enc = new TextEncoder();
    const bytes = enc.encode(JSON.stringify(jsonData, null, 2));
    let bin=''; for(let i=0;i<bytes.length;i++) bin+=String.fromCharCode(bytes[i]);
    const b64 = btoa(bin);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', this._apiUrl(filename));
      xhr.setRequestHeader('Authorization', 'token ' + (this._token || ''));
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        const d = JSON.parse(xhr.responseText);
        if (xhr.status === 200 || xhr.status === 201) {
          delete this._cache[filename];
          resolve({ ok: true, sha: d.commit?.sha?.slice(0,7) });
        } else reject(new Error(d.message || 'PUT failed'));
      };
      xhr.send(JSON.stringify({ message: 'ERP 데이터 업데이트: ' + filename, content: b64, sha: existingSha, branch: this._branch }));
    });
  },

  // 매출
  async getSales(month) {
    if (this._cache['sales'] && !month) return this._cache['sales'];
    const all = [];
    for (const f of ['sales_2026_1.json','sales_2026_2.json']) {
      try { const r = await this._get(f); all.push(...(month ? r.data.filter(s=>s.month===month) : r.data)); } catch(e) {}
    }
    return all;
  },
  async addSale(rec) {
    const r = await this._get('sales_2026_2.json');
    const id = 'SALE-' + Date.now();
    r.data.push({ id, ...rec });
    await this._put('sales_2026_2.json', r.data, r.sha);
    return id;
  },
  async updateSale(id, updates) {
    for (const f of ['sales_2026_1.json','sales_2026_2.json']) {
      try {
        const r = await this._get(f); const idx = r.data.findIndex(s=>s.id===id);
        if (idx>=0) { r.data[idx]={...r.data[idx],...updates}; await this._put(f,r.data,r.sha); return true; }
      } catch(e) {}
    }
    return false;
  },

  // 지출
  async getExpenses(month) {
    const r = await this._get('expenses_2026.json');
    return month ? r.data.filter(e=>e.month===month) : r.data;
  },
  async addExpense(rec) {
    const r = await this._get('expenses_2026.json');
    const id = 'EXP-' + Date.now();
    r.data.push({ id, ...rec });
    await this._put('expenses_2026.json', r.data, r.sha);
    return id;
  },

  // 고객
  async getCustomers(query) {
    const r = await this._get('customers.json');
    if (!query) return r.data;
    const q = query.toLowerCase();
    return r.data.filter(c=>c.name?.toLowerCase().includes(q)||c.chartNo?.includes(query)||c.phone?.includes(query));
  },
  async getCustomer(chartNo) {
    const r = await this._get('customers.json');
    return r.data.find(c=>c.chartNo===String(chartNo)) || null;
  },
  async addCustomer(data) {
    const r = await this._get('customers.json');
    const maxChart = Math.max(...r.data.map(c=>parseInt(c.chartNo)||0));
    const newChart = String(maxChart+1);
    const cust = { id:'CUST-'+newChart, chartNo:newChart, color:'#B8956A', visitHistory:[], ...data };
    r.data.push(cust);
    await this._put('customers.json', r.data, r.sha);
    if (typeof DataService !== 'undefined') DataService._store.customers = r.data;
    return newChart;
  },
  async updateCustomer(chartNo, updates) {
    const r = await this._get('customers.json');
    const idx = r.data.findIndex(c=>c.chartNo===String(chartNo));
    if (idx>=0) { r.data[idx]={...r.data[idx],...updates}; await this._put('customers.json',r.data,r.sha); return true; }
    return false;
  },

  // 고객 차트
  async getCustomerChart(chartNo) {
    for (const f of ['customer_charts_1.json','customer_charts_2.json']) {
      try { const r = await this._get(f); const c=r.data.find(x=>x.chartNo===String(chartNo)); if(c) return c; } catch(e){}
    }
    return null;
  },

  // 손익
  async getClosing(year, month) {
    const r = await this._get('closing_pl.json');
    if (!year) return r.data;
    return r.data.filter(p=>p.year===year&&(!month||p.month===month));
  },

  calcMonthlySummary(records) {
    const s={};
    records.forEach(r=>{
      const m=r.month||(r.date?r.date.slice(0,7):'');
      if(!s[m]) s[m]={month:m,cashTotal:0,cardTotal:0,krwTotal:0,tipTotal:0,count:0};
      s[m].cashTotal+=(r.cash||0)+(r.cashPlus10||0);
      s[m].cardTotal+=r.card||0; s[m].krwTotal+=r.krw||0;
      s[m].tipTotal+=r.tipDeduct||0; s[m].count++;
    });
    return Object.values(s);
  }
};

window.HSKB_DATA = HSKB_DATA;
HSKB_DATA.init();
console.log('[HSKB] Data Connector v2 로드됨');
