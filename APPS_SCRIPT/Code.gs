// ═══════════════════════════════════════════════════════════════
// HWASA K-Beauty ERP — Google Apps Script API
// Code.gs — 메인 라우터 (doGet / doPost)
// ═══════════════════════════════════════════════════════════════
// 배포 후 SPREADSHEET_ID 를 실제 스프레드시트 ID 로 교체하세요
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// ── 시트 헬퍼 ──────────────────────────────────────────────────
function _getSheet(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange('A1').setValue('[]');
  }
  return sheet;
}

function _readJson(sheetName) {
  var sheet = _getSheet(sheetName);
  var val = sheet.getRange('A1').getValue();
  if (!val || val === '') return [];
  try { return JSON.parse(val); } catch(e) { return []; }
}

function _writeJson(sheetName, data) {
  var sheet = _getSheet(sheetName);
  sheet.getRange('A1').setValue(JSON.stringify(data));
}

// ── 마스터 데이터 ──────────────────────────────────────────────
function _getMaster() {
  return {
    program:            _readJson('m_program'),
    menuHead:           _readJson('m_menuHead'),
    menuBody:           _readJson('m_menuBody'),
    events:             _readJson('m_events'),
    employees:          _readJson('m_employees'),
    memberGrades:       _readJson('m_memberGrades'),
    expenseItems:       _readJson('m_expenseItems'),
    purchaseCategories: _readJson('m_purchaseCats'),
    suppliers:          _readJson('m_suppliers'),
  };
}

function _writeMaster(data) {
  if (data.program)            _writeJson('m_program',      data.program);
  if (data.menuHead)           _writeJson('m_menuHead',     data.menuHead);
  if (data.menuBody)           _writeJson('m_menuBody',     data.menuBody);
  if (data.events)             _writeJson('m_events',       data.events);
  if (data.employees)          _writeJson('m_employees',    data.employees);
  if (data.memberGrades)       _writeJson('m_memberGrades', data.memberGrades);
  if (data.expenseItems)       _writeJson('m_expenseItems', data.expenseItems);
  if (data.purchaseCategories) _writeJson('m_purchaseCats', data.purchaseCategories);
  if (data.suppliers)          _writeJson('m_suppliers',    data.suppliers);
}

// ── 월별 시트명 ────────────────────────────────────────────────
function _salesSheet(month)      { return month ? 'sales_'      + month.replace('-','') : 'sales'; }
function _attendSheet(month)     { return month ? 'attendance_' + month.replace('-','') : 'attendance'; }

// ── doGet ──────────────────────────────────────────────────────
function doGet(e) {
  try {
    var table = e.parameter.table || '';
    var month = e.parameter.month || '';  // e.g. '2026-03'
    var data;

    switch (table) {
      case 'master':
        data = _getMaster();
        break;
      case 'customers':
        data = _readJson('customers');
        break;
      case 'sales':
        data = _readJson(_salesSheet(month));
        break;
      case 'purchase':
        data = _readJson(month ? 'purchase_' + month.replace('-','') : 'purchase');
        break;
      case 'attendance':
        data = _readJson(_attendSheet(month));
        break;
      case 'salary':
        data = _readJson('salary');
        break;
      case 'contracts':
        data = _readJson('contracts');
        break;
      default:
        return _fail('Unknown table: ' + table);
    }

    return _ok(data);
  } catch (err) {
    return _fail(err.message);
  }
}

// ── doPost ─────────────────────────────────────────────────────
function doPost(e) {
  try {
    var body  = JSON.parse(e.postData.contents);
    var table = body.table || '';
    var data  = body.data;
    var month = body.month || '';

    switch (table) {
      case 'master':
        _writeMaster(data);
        break;
      case 'customers':
        _writeJson('customers', data);
        break;
      case 'sales':
        _writeJson(_salesSheet(month), data);
        break;
      case 'purchase':
        _writeJson(month ? 'purchase_' + month.replace('-','') : 'purchase', data);
        break;
      case 'attendance':
        _writeJson(_attendSheet(month), data);
        break;
      case 'salary':
        _writeJson('salary', data);
        break;
      case 'contracts':
        _writeJson('contracts', data);
        break;
      default:
        return _fail('Unknown table: ' + table);
    }

    return _ok({ written: true });
  } catch (err) {
    return _fail(err.message);
  }
}

// ── 응답 헬퍼 ──────────────────────────────────────────────────
function _ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}
function _fail(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
