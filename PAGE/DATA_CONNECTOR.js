/**
 * HSKB ERP Data Connector v3
 * GitHub Pages + GitHub REST API 기반 데이터 연동
 * DataService._store에 실제 데이터 자동 주입
 */

const HSKB_DATA = {
  _owner: 'man0913AI', _repo: 'HwasaKBeauty', _branch: 'main', _dataPath: 'data',
  _token: null, _cache: {},

  init() {
    this._token = localStorage.getItem('hskb_gh_token') || null;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._autoSync());
    } else {
      setTimeout(() => this._autoSync(), 500);
    }
    return this;
  },

  async _autoSync() {
    try {
      const BASE = 'https://raw.githubusercontent.com/' + this._owner + '/' + this._repo + '/main/' + this._dataPath;
      const t = Date.now();

      // 병렬 fetch
      const [cResp, s1Resp, s2Resp, eResp, mResp, pResp, attResp, conResp, salResp] = await Promise.all([
        fetch(BASE + '/customers.json?t=' + t),
        fetch(BASE + '/sales_2026_1.json?t=' + t),
        fetch(BASE + '/sales_2026_2.json?t=' + t),
        fetch(BASE + '/expenses_2026.json?t=' + t),
        fetch(BASE + '/master.json?t=' + t),
        fetch(BASE + '/purchase.json?t=' + t),
        fetch(BASE + '/attendance.json?t=' + t),
        fetch(BASE + '/contracts.json?t=' + t),
        fetch(BASE + '/salary.json?t=' + t),
      ]);

      // 고객 데이터 주입
      if (cResp.ok) {
        const customers = await cResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.customers = customers;
          console.log('[HSKB] 고객 ' + customers.length + '명 DataService 주입 완료');
          window.dispatchEvent(new CustomEvent('hskb:customers:loaded', { detail: { customers } }));
        }
      }

      // 매출 데이터 주입
      if (s1Resp.ok && s2Resp.ok) {
        const [sales1, sales2] = await Promise.all([s1Resp.json(), s2Resp.json()]);
        const allSales = [...sales1, ...sales2];
        if (typeof DataService !== 'undefined') {
          const salesMap = {};
          allSales.forEach(s => {
            const dt = s.date || '';
            if (!dt) return;
            if (!salesMap[dt]) salesMap[dt] = { rows: [], expenses: [] };
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
          allSales.forEach(s => { const m = s.month || ''; if (!salesByMonth[m]) salesByMonth[m] = []; salesByMonth[m].push(s); });
          DataService._store.salesByMonth = salesByMonth;
          console.log('[HSKB] 매출 ' + allSales.length + '건 DataService 주입 완료');
          window.dispatchEvent(new CustomEvent('hskb:sales:loaded', { detail: { sales: allSales } }));
        }
        this._cache['sales'] = allSales;
      }

      // 지출 데이터 주입 (expenses_2026.json → _store.expenses, 매입과 분리)
      if (eResp.ok) {
        const expenses = await eResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.expenses = expenses;
          console.log('[HSKB] 지출 ' + expenses.length + '건 DataService 주입 완료');
          window.dispatchEvent(new CustomEvent('hskb:expenses:loaded', { detail: { expenses } }));
        }
        this._cache['expenses_2026.json'] = { data: expenses, sha: null };
      }

      // 마스터 데이터 주입
      if (mResp.ok) {
        const masterData = await mResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.master = masterData;
        }
        if (typeof MASTER !== 'undefined') {
          Object.keys(masterData).forEach(k => { MASTER[k] = masterData[k]; });
        }
        this._cache['master.json'] = { data: masterData, sha: null };
        console.log('[HSKB] 마스터 데이터 DataService 주입 완료');
        window.dispatchEvent(new CustomEvent('hskb:master:loaded', { detail: { master: masterData } }));
      }

      // 매입 데이터 주입 (purchase.json → _store.purchase)
      if (pResp.ok) {
        const purchase = await pResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.purchase = purchase;
          console.log('[HSKB] 매입 ' + purchase.length + '건 DataService 주입 완료');
        }
        this._cache['purchase.json'] = { data: purchase, sha: null };
      }

      // 출퇴근 데이터 주입
      if (attResp.ok) {
        const attendance = await attResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.attendance = attendance;
          console.log('[HSKB] 출퇴근 데이터 DataService 주입 완료');
        }
        this._cache['attendance.json'] = { data: attendance, sha: null };
      }

      // 계약서 데이터 주입
      if (conResp.ok) {
        const contracts = await conResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.contracts = contracts;
          console.log('[HSKB] 계약서 ' + contracts.length + '건 DataService 주입 완료');
        }
        this._cache['contracts.json'] = { data: contracts, sha: null };
      }

      // 급여 데이터 주입
      if (salResp.ok) {
        const salary = await salResp.json();
        if (typeof DataService !== 'undefined') {
          DataService._store.salary = salary;
          console.log('[HSKB] 급여 ' + salary.length + '건 DataService 주입 완료');
        }
        this._cache['salary.json'] = { data: salary, sha: null };
      }

      console.log('[HSKB] 자동 동기화 완료');
      window.dispatchEvent(new CustomEvent('hskb:sync:done'));
    } catch(e) {
      console.warn('[HSKB] 자동 동기화 실패:', e.message);
    }
  },

  _apiUrl(f) { return 'https://api.github.com/repos/' + this._owner + '/' + this._repo + '/contents/' + this._dataPath + '/' + f; },

  async _get(filename) {
    if (this._cache[filename]?.sha) return this._cache[filename];
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this._apiUrl(filename));
      if (this._token) xhr.setRequestHeader('Authorization', 'token ' + this._token);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const raw = atob(data.content.replace(/\n/g, ''));
          const bytes = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
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
    let bin = ''; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
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
          resolve({ ok: true, sha: d.commit?.sha?.slice(0, 7) });
        } else reject(new Error(d.message || 'PUT failed'));
      };
      xhr.send(JSON.stringify({ message: 'ERP 데이터 업데이트: ' + filename, content: b64, sha: existingSha, branch: this._branch }));
    });
  },

  // 범용 JSON 저장 (SHA 자동 처리)
  async _saveJson(filename, data) {
    let sha = null;
    try {
      if (this._cache[filename]?.sha) {
        sha = this._cache[filename].sha;
      } else {
        const r = await this._get(filename);
        sha = r.sha;
      }
    } catch(e) { /* 신규 파일 */ }
    const result = await this._put(filename, data, sha);
    this._cache[filename] = { data, sha: result.sha || sha };
    return result;
  },

  // 마스터 저장 (MASTER 객체 동기화 포함)
  async saveMaster(data) {
    const result = await this._saveJson('master.json', data);
    if (typeof MASTER !== 'undefined') {
      Object.keys(data).forEach(k => { MASTER[k] = data[k]; });
    }
    return result;
  },

  // 매출
  async getSales(month) {
    if (this._cache['sales'] && !month) return this._cache['sales'];
    const all = [];
    for (const f of ['sales_2026_1.json', 'sales_2026_2.json']) {
      try { const r = await this._get(f); all.push(...(month ? r.data.filter(s => s.month === month) : r.data)); } catch(e) {}
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
    for (const f of ['sales_2026_1.json', 'sales_2026_2.json']) {
      try {
        const r = await this._get(f); const idx = r.data.findIndex(s => s.id === id);
        if (idx >= 0) { r.data[idx] = { ...r.data[idx], ...updates }; await this._put(f, r.data, r.sha); return true; }
      } catch(e) {}
    }
    return false;
  },

  // 고객
  async getCustomers(query) {
    const r = await this._get('customers.json');
    if (!query) return r.data;
    const q = query.toLowerCase();
    return r.data.filter(c => c.name?.toLowerCase().includes(q) || c.chartNo?.includes(query) || c.phone?.includes(query));
  },
  async getCustomer(chartNo) {
    const r = await this._get('customers.json');
    return r.data.find(c => c.chartNo === String(chartNo)) || null;
  },
  async addCustomer(data) {
    const r = await this._get('customers.json');
    const maxChart = Math.max(...r.data.map(c => parseInt(c.chartNo) || 0));
    const newChart = String(maxChart + 1);
    const cust = { id: 'CUST-' + newChart, chartNo: newChart, color: '#B8956A', visitHistory: [], ...data };
    r.data.push(cust);
    await this._put('customers.json', r.data, r.sha);
    if (typeof DataService !== 'undefined') DataService._store.customers = r.data;
    return newChart;
  },
  async updateCustomer(chartNo, updates) {
    const r = await this._get('customers.json');
    const idx = r.data.findIndex(c => c.chartNo === String(chartNo));
    if (idx >= 0) { r.data[idx] = { ...r.data[idx], ...updates }; await this._put('customers.json', r.data, r.sha); return true; }
    return false;
  },

  // 고객 차트
  async getCustomerChart(chartNo) {
    for (const f of ['customer_charts_1.json', 'customer_charts_2.json']) {
      try { const r = await this._get(f); const c = r.data.find(x => x.chartNo === String(chartNo)); if (c) return c; } catch(e) {}
    }
    return null;
  },

  // 손익
  async getClosing(year, month) {
    const r = await this._get('closing_pl.json');
    if (!year) return r.data;
    return r.data.filter(p => p.year === year && (!month || p.month === month));
  },

  calcMonthlySummary(records) {
    const s = {};
    records.forEach(r => {
      const m = r.month || (r.date ? r.date.slice(0, 7) : '');
      if (!s[m]) s[m] = { month: m, cashTotal: 0, cardTotal: 0, krwTotal: 0, tipTotal: 0, count: 0 };
      s[m].cashTotal += (r.cash || 0) + (r.cashPlus10 || 0);
      s[m].cardTotal += r.card || 0; s[m].krwTotal += r.krw || 0;
      s[m].tipTotal += r.tipDeduct || 0; s[m].count++;
    });
    return Object.values(s);
  }
};

window.HSKB_DATA = HSKB_DATA;
HSKB_DATA.init();

// DataService.write 오버라이드 — GitHub에도 자동 저장
if (typeof DataService !== 'undefined') {
  const _origWrite = DataService.write.bind(DataService);
  DataService.write = async function(t, d) {
    await _origWrite(t, d);
    const token = localStorage.getItem('hskb_gh_token');
    if (!token) {
      console.warn('[HSKB] GitHub PAT 없음 — ' + t + ' 메모리에만 저장됨');
      return;
    }
    HSKB_DATA._token = token;

    const fileMap = {
      master:     () => HSKB_DATA.saveMaster(d),
      purchase:   () => HSKB_DATA._saveJson('purchase.json', d),
      attendance: () => HSKB_DATA._saveJson('attendance.json', d),
      contracts:  () => HSKB_DATA._saveJson('contracts.json', d),
      salary:     () => HSKB_DATA._saveJson('salary.json', d),
    };

    if (fileMap[t]) {
      try {
        await fileMap[t]();
        console.log('[HSKB] ' + t + ' GitHub 저장 완료');
      } catch(e) {
        console.warn('[HSKB] ' + t + ' GitHub 저장 실패 (PAT 확인):', e.message);
      }
    }
  };
}

console.log('[HSKB] Data Connector v3 로드됨');
