# Goose Task — Phase 4 급여: 담당자별 팁 집계 개선

## 목표
PAGE_ERP_MEMBER_SALARY.html의 calcTipsByEmp 함수 개선.
현재: 팁을 직원 수로 균등 분배
목표: sales 데이터의 therapist 필드를 사용해 담당자별 직접 집계

## 수정 내용
function calcTipsByEmp(salesData, ym) 수정:
- row.therapist 필드가 있으면 해당 직원(nameKr 기준)에게 tipDeduct 전액 집계
- row.therapist가 없으면 기존 균등 분배 유지
- EMPLOYEES.find(e => e.nameKr === row.therapist) 로 매핑

## 파일
PAGE/PAGE_ERP_MEMBER_SALARY.html
