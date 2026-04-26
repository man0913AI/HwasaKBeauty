# Aider Task — Phase 2 매출 담당자(therapist) 컬럼 추가

## 목표
PAGE_ERP_SALES.html의 SalesDailyInput 스프레드시트에 담당자(therapist) 컬럼 추가.
팁(tipDeduct)이 담당자별로 집계되어 급여 계산에 사용됨.

## 수정 내용
1. mkSaleRow에 `therapist:''` 필드 추가
2. cols 배열에 {k:'therapist', l:'담당자', w:70, t:'sel', opts:EMPLOYEES.map(e=>e.nameKr)} 추가
   - 메뉴 컬럼 다음에 삽입
3. ss-total 합계 행 colspan 조정 (컬럼 수가 1 증가)
4. SalesList 상세 조회 테이블에도 담당자 컬럼 추가

## 파일
PAGE/PAGE_ERP_SALES.html
