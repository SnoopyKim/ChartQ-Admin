# ChartQ 시스템 관리 기능

ChartQ 관리자 콘솔의 시스템 관리 기능 구현 문서

## 🎯 기능 개요

시스템 관리 기능(`/system`)은 앱 버전 관리와 서비스 상태 제어를 통합한 관리자 전용 기능입니다.

**주요 기능**:
- 📱 앱 버전 배포 및 관리 
- 🛠️ 서비스 점검 모드 제어
- 📊 버전 히스토리 조회 (`/system/history`)

## 🏗️ 구현 구조

### 파일 구조
```
app/(admin)/system/
├── page.tsx                    # 메인 시스템 관리 페이지
├── history/page.tsx            # 버전 히스토리 페이지
└── components/
    ├── app-version-card.tsx    # 버전 관리 컴포넌트
    └── service-status-card.tsx # 서비스 상태 컴포넌트

services/system.ts              # API 서비스 함수들
types/system.ts                 # TypeScript 타입 정의
supabase/admin-rls-policies.sql # RLS 보안 정책
```

### 데이터베이스 테이블
```sql
-- 앱 버전 관리
app_versions (
  latest_version, minimum_version, release_notes, 
  is_active, created_at, updated_at
)

-- 서비스 상태 관리  
service_status (
  is_maintenance_mode, maintenance_message,
  maintenance_start_time, maintenance_end_time
)
```

## 🔧 주요 기능

### 1. 앱 버전 관리
- **현재 버전 표시**: 최신/최소 버전, 릴리즈 노트
- **새 버전 배포**: Dialog 폼으로 버전 정보 입력 → 자동 기존 버전 비활성화
- **버전 히스토리**: 과거 배포 이력 조회 (최대 10개)

### 2. 서비스 상태 제어
- **실시간 상태 표시**: 정상 서비스 🟢 / 점검 모드 🟠
- **점검 모드 토글**: 스위치로 원클릭 제어
- **점검 메시지**: 사용자에게 표시될 안내 메시지 설정

## 🔒 보안 및 권한

### RLS 정책 (Compact)
```sql
-- 관리자 확인 함수
CREATE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE((
    SELECT type = 'ADMIN' FROM profiles WHERE id = auth.uid()
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 테이블 정책
-- app_versions: 누구나 활성 버전 조회, 관리자만 CUD
-- service_status: 누구나 상태 조회, 관리자만 수정

-- 관리 함수 (권한 체크 포함)
SELECT activate_new_version('1.2.0', '1.1.0', '릴리즈 노트');
SELECT toggle_maintenance_mode(true, '점검 안내 메시지');
```

### 권한 체계
- **관리자**: `profiles.type = 'ADMIN'` 사용자만 시스템 관리 가능
- **일반 사용자**: 활성 버전 정보 & 서비스 상태 조회만 가능 (앱용)
- **비회원**: 앱에서 버전 확인 및 점검 모드 확인 가능

## 🎨 UI/UX 특징

### 시각적 구분
- **정상 서비스**: 초록색 + CheckCircle 아이콘
- **점검 모드**: 주황색 + AlertTriangle 아이콘  
- **활성 버전**: 초록색 배지
- **로딩 상태**: 스켈레톤 UI

### 안전한 작업
- 중요 작업 시 확인 다이얼로그
- 실시간 토스트 피드백
- 에러 상황 명확한 안내

## 📋 운영 가이드

### 새 버전 배포 절차
1. 앱스토어 배포 완료 확인
2. 시스템 관리 → "새 버전 배포"
3. 버전 정보 + 릴리즈 노트 입력
4. 배포 → 기존 버전 자동 비활성화

### 점검 모드 운영
1. 점검 모드 스위치 ON + 메시지 입력
2. 앱 사용자에게 점검 안내 표시
3. 작업 완료 후 스위치 OFF

## 🛠️ API 함수

```typescript
// services/system.ts
getAppVersions()              // 현재 활성 버전 조회
createNewVersion(data)        // 새 버전 배포  
getServiceStatus()            // 서비스 상태 조회
toggleMaintenanceMode(flag)   // 점검 모드 토글
getVersionHistory()           // 버전 히스토리 (10개)
```

## 🐛 문제 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| 시스템 페이지 접근 불가 | 관리자 권한 없음 | `profiles.type = 'ADMIN'` 확인 |
| Dialog 안 닫힘 | 컴포넌트 구조 문제 | Radix UI 구조 사용 |
| 버전 배포 실패 | RLS 정책 | 권한 및 함수 확인 |

## 📈 향후 계획

**단기**:
- [ ] 버전 히스토리 페이지네이션
- [ ] 점검 예약 스케줄링

**장기**:  
- [ ] A/B 테스트 점진적 배포
- [ ] 실시간 상태 업데이트
- [ ] 사용자 분포 통계

---
*구현일: 2024-07-27 | 기술스택: Next.js 14 + Supabase + TypeScript*