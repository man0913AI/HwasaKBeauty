
/**
 * HSKB ERP Data Connector
 * GitHub Pages + GitHub REST API 기반 데이터 연동
 * 각 ERP 페이지에서 이 파일을 include하여 사용
 */

const HSKB_DATA = {
  // GitHub 설정
  _owner: 'man0913AI',
  _repo: 'HwasaKBeauty',
  _branch: 'main',
  _dataPath: 'data',
  _token: null, // 런타임에 설정
  
  // 캐시
  _cache: {},
  
  // 토큰 설정 (localStorage에서 로드)
  init() {
    this._token = localStorage.getItem('hskb_gh_token') || window._ghToken || null;
    return this;
  },
  
  // API URL
  _apiUrl(filename) {
    return `https://api.github.com/repos/${this._owner}/${this._repo}/contents/${this._dataPath}/${filename}`;
  },
  
  // GitHub API GET
  async _get(filename) {
    if(this._cache[filename]) return this._cache[filename];
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this._apiUrl(filename));
      if(this._token) xhr.setRequestHeader('Authorization', 'token '+this._token);
      xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
      xhr.onload = () => {
        if(xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const raw = atob(data.content.replace(/\n/g,''));
          const bytes = new Uint8Array(raw.length);
          for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
          const text = new TextDecoder('utf-8').decode(bytes);
          const parsed = JSON.parse(text);
          this._cache[filename] = { data: parsed, sha: data.sha };
          resolve(this._cache[filename]);
        } else reject(new Error('HTTP '+xhr.status));
      };
      xhr.onerror = () => reject(new Error('XHR Error'));
      xhr.send();
    });
  },
  
  // GitHub API PUT (저장)
  async _put(filename, jsonData, existingSha) {
    const enc = new TextEncoder();
    const bytes = enc.encode(JSON.stringify(jsonData, null, 2));
    let binary = '';
    for(let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', this._apiUrl(filename));
      xhr.setRequestHeader('Authorization', 'token '+(this._token||''));
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        const d = JSON.parse(xhr.responseText);
        if(xhr.status === 200 || xhr.status === 201) {
          delete this._cache[filename]; // 캐시 무효화
          resolve({ ok: true, sha: d.commit?.sha?.slice(0,7) });
        } else reject(new Error(d.message || 'PUT failed'));
      };
      xhr.send(JSON.stringify({
        message: `ERP 데이터 업데이트: ${filename}`,
        content: b64, sha: existingSha, branch: this._branch
      }));
    });
  },
  
  // =============================================
  // 매출 (Sales)
  // =============================================
  async getSales(month) {
    const all = [];
    for(const fname of ['sales_2026_1.json','sales_2026_2.json']) {
      try {
        const r = await this._get(fname);
        const filtered = month ? r.data.filter(s=>s.month===month) : r.data;
        all.push(...filtered);
      } catch(e) { console.warn('sales load error:', fname, e); }
    }
    return all;
  },
  
  async addSale(saleRecord) {
    const r = await this._get('sales_2026_2.json');
    const newId = 'SALE-' + Date.now();
    r.data.push({ id: newId, ...saleRecord });
    await this._put('sales_2026_2.json', r.data, r.sha);
    return newId;
  },
  
  async updateSale(id, updates) {
    for(const fname of ['sales_2026_1.json','sales_2026_2.json']) {
      try {
        const r = await this._get(fname);
        const idx = r.data.findIndex(s=>s.id===id);
        if(idx >= 0) {
          r.data[idx] = { ...r.data[idx], ...updates };
          await this._put(fname, r.data, r.sha);
          return true;
        }
      } catch(e) {}
    }
    return false;
  },
  
  // =============================================
  // 지출 (Expenses)
  // =============================================
  async getExpenses(month) {
    const r = await this._get('expenses_2026.json');
    return month ? r.data.filter(e=>e.month===month) : r.data;
  },
  
  async addExpense(expRecord) {
    const r = await this._get('expenses_2026.json');
    const newId = 'EXP-' + Date.now();
    r.data.push({ id: newId, ...expRecord });
    await this._put('expenses_2026.json', r.data, r.sha);
    return newId;
  },
  
  // =============================================
  // 고객 (Customers)
  // =============================================
  async getCustomers(query) {
    const r = await this._get('customers.json');
    if(!query) return r.data;
    const q = query.toLowerCase();
    return r.data.filter(c=>
      c.name?.toLowerCase().includes(q) ||
      c.chartNo?.includes(query) ||
      c.phone?.includes(query)
    );
  },
  
  async getCustomer(chartNo) {
    const r = await this._get('customers.json');
    return r.data.find(c=>c.chartNo===String(chartNo)) || null;
  },
  
  async addCustomer(custData) {
    const r = await this._get('customers.json');
    const maxChart = Math.max(...r.data.map(c=>parseInt(c.chartNo)||0));
    const newChart = String(maxChart + 1);
    const newCust = { id: 'CUST-'+newChart, chartNo: newChart, color:'#B8956A', visitHistory:[], ...custData };
    r.data.push(newCust);
    await this._put('customers.json', r.data, r.sha);
    return newChart;
  },
  
  async updateCustomer(chartNo, updates) {
    const r = await this._get('customers.json');
    const idx = r.data.findIndex(c=>c.chartNo===String(chartNo));
    if(idx >= 0) {
      r.data[idx] = { ...r.data[idx], ...updates };
      await this._put('customers.json', r.data, r.sha);
      return true;
    }
    return false;
  },
  
  // =============================================
  // 고객 차트 (Customer Charts)
  // =============================================
  async getCustomerChart(chartNo) {
    for(const fname of ['customer_charts_1.json','customer_charts_2.json']) {
      try {
        const r = await this._get(fname);
        const chart = r.data.find(c=>c.chartNo===String(chartNo));
        if(chart) return chart;
      } catch(e) {}
    }
    return null;
  },
  
  // =============================================
  // 손익계산서 (P&L)
  // =============================================
  async getClosing(year, month) {
    const r = await this._get('closing_pl.json');
    if(!year) return r.data;
    return r.data.filter(p=>p.year===year && (!month || p.month===month));
  },
  
  // =============================================
  // 로컬 캐시 → 스프레드시트 저장 (Google Sheets 연동)
  // =============================================
  async saveToLocalStorage(key, data) {
    localStorage.setItem('hskb_'+key, JSON.stringify({ data, updatedAt: new Date().toISOString() }));
  },
  
  loadFromLocalStorage(key) {
    const raw = localStorage.getItem('hskb_'+key);
    return raw ? JSON.parse(raw).data : null;
  },
  
  // 월별 요약 계산
  calcMonthlySummary(salesRecords) {
    const summary = {};
    salesRecords.forEach(s => {
      const m = s.month || (s.date ? s.date.slice(0,7) : '');
      if(!summary[m]) summary[m] = { month:m, cashTotal:0, cardTotal:0, krwTotal:0, tipTotal:0, count:0, maleCount:0, femaleCount:0 };
      summary[m].cashTotal += (s.cash||0) + (s.cashPlus10||0);
      summary[m].cardTotal += s.card||0;
      summary[m].krwTotal += s.krw||0;
      summary[m].tipTotal += s.tipDeduct||0;
      summary[m].count++;
      if(s.isMale) summary[m].maleCount++;
      if(s.isFemale) summary[m].femaleCount++;
    });
    return Object.values(summary);
  }
};

// 전역 등록
window.HSKB_DATA = HSKB_DATA;
HSKB_DATA.init();
console.log('[HSKB] Data Connector 로드됨', { token: !!HSKB_DATA._token });
