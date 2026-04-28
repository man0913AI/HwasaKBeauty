// ============================================================
// HSKB ERP DATA SERVICE - 실제 데이터 연동 모듈
// 각 JSON 파일에서 데이터를 fetch하여 ERP 페이지에 제공
// 파일: PAGE/DATA_SERVICE.js
// ============================================================

const DATA_BASE = 'https://man0913ai.github.io/HwasaKBeauty/data/';

const HSKB_DataService = {
  _cache: {},
  _loadingPromises: {},

  async load(filename) {
    if (this._cache[filename]) return this._cache[filename];
    if (this._loadingPromises[filename]) return this._loadingPromises[filename];
    this._loadingPromises[filename] = fetch(DATA_BASE + filename + '?t=' + Date.now())
      .then(r => r.json())
      .then(data => { this._cache[filename] = data; delete this._loadingPromises[filename]; return data; })
      .catch(err => { console.warn('[HSKB] ' + filename + ' 로드 실패:', err); delete this._loadingPromises[filename]; return []; });
    return this._loadingPromises[filename];
  },

  clearCache(filename) { if (filename) delete this._cache[filename]; else this._cache = {}; },

  sales: {
    async getAll() { return HSKB_DataService.load('sales_records.json'); },
    async getDaily() { return HSKB_DataService.load('sales_daily.json'); },
    async getMonthly() { return HSKB_DataService.load('sales_monthly.json'); },
    async getByDate(date) { const all = await HSKB_DataService.load('sales_records.json'); return all.filter(s => s.date === date); },
    async getByMonth(year, month) { const all = await HSKB_DataService.load('sales_records.json'); return all.filter(s => s.year === year && s.month === month); },
    async getByCustomer(name) { const all = await HSKB_DataService.load('sales_records.json'); return all.filter(s => s.customerName === name); },
    async getDailyClosing(date) {
      const records = await HSKB_DataService.sales.getByDate(date);
      if (!records.length) return null;
      const c = { date, guestCount: records.length, maleCount: records.filter(r=>r.gender==='M').length, femaleCount: records.filter(r=>r.gender==='F').length,
        totalDeduct: records.reduce((s,r)=>s+r.totalDeduct,0), totalTip: records.reduce((s,r)=>s+r.totalTip,0),
        totalCash: records.reduce((s,r)=>s+r.totalCash,0), totalCash10: records.reduce((s,r)=>s+r.totalCash10,0),
        totalCard: records.reduce((s,r)=>s+r.totalCard,0), totalKRW: records.reduce((s,r)=>s+r.totalKRW,0),
        totalUnpaid: records.reduce((s,r)=>s+r.totalUnpaid,0), records };
      c.totalRevenue = c.totalCash + c.totalCash10 + c.totalCard + c.totalKRW;
      c.remaining = c.totalRevenue - c.totalUnpaid;
      return c;
    },
  },

  expense: {
    async getAll() { return HSKB_DataService.load('expense_records.json'); },
    async getMonthly() { return HSKB_DataService.load('expense_monthly.json'); },
    async getByMonth(year, month) { const all = await HSKB_DataService.load('expense_records.json'); return all.filter(e => e.year === year && e.month === month); },
    async getByDate(date) { const all = await HSKB_DataService.load('expense_records.json'); return all.filter(e => e.date === date); },
  },

  customers: {
    async getAll() { return HSKB_DataService.load('customers.json'); },
    async getById(id) { const all = await HSKB_DataService.load('customers.json'); return all.find(c => c.id === id || c.chartNo === parseInt(id)); },
    async getByName(name) { const all = await HSKB_DataService.load('customers.json'); return all.filter(c => c.name && c.name.includes(name)); },
    async getByGrade(grade) { const all = await HSKB_DataService.load('customers.json'); return all.filter(c => c.grade === grade); },
    async search(query) {
      const all = await HSKB_DataService.load('customers.json');
      const q = (query||'').toLowerCase();
      return all.filter(c => (c.name&&c.name.toLowerCase().includes(q))||(c.nameEn&&c.nameEn.toLowerCase().includes(q))||(c.phone&&c.phone.includes(q))||(c.chartNo&&String(c.chartNo).includes(q)));
    },
  },

  pl: {
    async getAll() { return HSKB_DataService.load('pl_monthly.json'); },
    async getByYear(year) { const all = await HSKB_DataService.load('pl_monthly.json'); return all.filter(p => p.year === year); },
    async getSummary() {
      const all = await HSKB_DataService.load('pl_monthly.json');
      return { totalRevenue: all.reduce((s,p)=>s+p.revenue,0), totalNetProfit: all.reduce((s,p)=>s+p.netProfit,0), totalOperatingProfit: all.reduce((s,p)=>s+p.operatingProfit,0), months: all.length };
    },
  },

  closing: {
    async getMonthlyStatement(year, month) {
      const [salesM, expenseM] = await Promise.all([HSKB_DataService.load('sales_monthly.json'), HSKB_DataService.load('expense_monthly.json')]);
      const s = salesM.find(m => m.year === year && m.month === month) || {};
      const e = expenseM.find(m => m.year === year && m.month === month) || {};
      const totalIncome = (s.totalCash||0)+(s.totalCash10||0)+(s.totalCard||0)+(s.totalKRW||0);
      return { year, month, income: {cash:s.totalCash||0,cash10:s.totalCash10||0,card:s.totalCard||0,krw:s.totalKRW||0,total:totalIncome}, expense:{cat1:e.cat1||0,cat2:e.cat2||0,cat3:e.cat3||0,cat4:e.cat4||0,cat5:e.cat5||0,cat6:e.cat6||0,total:e.total||0}, netProfit:totalIncome-(e.total||0), guestCount:s.guestCount||0 };
    },
    async getAllMonthly() {
      const [salesM, expenseM] = await Promise.all([HSKB_DataService.load('sales_monthly.json'), HSKB_DataService.load('expense_monthly.json')]);
      const months = new Set([...salesM.map(m=>m.yearMonth),...expenseM.map(m=>m.yearMonth)]);
      return [...months].sort().map(ym => {
        const [y,mo] = ym.split('-').map(Number);
        const s = salesM.find(m=>m.yearMonth===ym)||{};
        const e = expenseM.find(m=>m.yearMonth===ym)||{};
        const totalIncome = (s.totalCash||0)+(s.totalCash10||0)+(s.totalCard||0)+(s.totalKRW||0);
        return { yearMonth:ym, year:y, month:mo, totalIncome, totalExpense:e.total||0, netProfit:totalIncome-(e.total||0) };
      });
    },
  },
};

window.HSKB_DataService = HSKB_DataService;