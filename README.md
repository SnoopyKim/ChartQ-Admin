# ChartQ Admin Console

ChartQ 차트 공부 앱의 관리자 웹 콘솔입니다.

Next.js와 shadcn을 사용하여 UI를 구성하고, Supabase에서 데이터를 불러옵니다.
Study 컨텐츠 제작 시 Tiptap 라이브러리를 사용한 WYSIWYG 에디터를 활용합니다.

## Features

- Next.js App Router 기반
- shadcn/ui 컴포넌트 사용 (Button, Card, Dialog 등)
- Supabase 인증 및 데이터 관리 (인증, 데이터베이스 쿼리)
- Tiptap WYSIWYG 에디터 (Study 컨텐츠 제작)
- 관리 기능: Dashboard (개요), Quiz (퀴즈 관리), Study (스터디 컨텐츠 관리), Tag (태그 관리), Users (사용자 관리)
- 사이드바 네비게이션
- 검색 바 및 폼 메시지 컴포넌트
- 이미지 업로더

## Routes

- /dashboard: 관리 대시보드
- /quiz: 퀴즈 목록 및 관리
- /study: 스터디 컨텐츠 목록 및 에디터
- /tag: 태그 관리
- /users: 사용자 목록 및 관리
- /sign-in: 로그인 페이지
- /access-denied: 접근 거부 페이지

## Setup

1. Supabase 프로젝트 생성

2. 환경 변수 설정 (.env.local):

   ```
   NEXT_PUBLIC_SUPABASE_URL=[SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE PROJECT API ANON KEY]
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

## Components

- Editor: Tiptap 기반 WYSIWYG (bubble menu, floating menu 포함)
- Sidebar: 관리 메뉴 아이템
- Services: Quiz, Study, Tag, Users API 호출
- Hooks: use-dialog (다이얼로그 관리), use-toast (토스트 알림)
