import Study from "./study";

// 기본 스터디 조회 기록 타입
export interface StudyAnalyticsRecord {
  id: string;
  user_id: string;
  study_id: string;
  viewed_at: string;
  user_type: 'HOBBY' | 'BASIC' | 'PLUS' | 'PRO';
}

// 스터디별 조회수 (Flutter 앱용)
export interface StudyViewCount {
  study_id: string;
  view_count: number;
  unique_users: number;
}

// 스터디별 상세 통계 (관리자 콘솔용)
export interface StudyStatsDetailed {
  id: string;
  title: string;
  subtitle?: string;
  is_premium: boolean;
  order?: number;
  total_views: number;
  unique_users: number;
  hobby_views: number;
  basic_views: number;
  plus_views: number;
  pro_views: number;
  last_viewed_at?: string;
  first_viewed_at?: string;
  views_last_7_days: number;
  views_last_30_days: number;
}

// 일별 통계
export interface DailyStudyStats {
  date: string;
  study_id: string;
  title: string;
  is_premium: boolean;
  daily_views: number;
  daily_unique_users: number;
  daily_hobby_views: number;
  daily_basic_views: number;
  daily_plus_views: number;
  daily_pro_views: number;
}

// 사용자 타입별 통계
export interface UserTypeStats {
  user_type: 'HOBBY' | 'BASIC' | 'PLUS' | 'PRO';
  total_views: number;
  unique_users: number;
  unique_studies_viewed: number;
  avg_views_per_day: number;
}

// 월별 통계
export interface MonthlyStats {
  month: string;
  total_views: number;
  unique_users: number;
  unique_studies_viewed: number;
  premium_views: number;
  free_views: number;
}

// 인기 스터디 (최근 30일)
export interface PopularStudy {
  id: string;
  title: string;
  is_premium: boolean;
  views_30_days: number;
  unique_users_30_days: number;
  avg_views_per_user: number;
}

// 대시보드 통계 요약
export interface DashboardStats {
  totalViews: number;
  totalUniqueUsers: number;
  totalStudies: number;
  premiumViews: number;
  freeViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  topStudies: PopularStudy[];
  userTypeBreakdown: UserTypeStats[];
  recentDailyStats: DailyStudyStats[];
}

// API 응답 타입
export interface StudyAnalyticsResponse<T> {
  data?: T;
  error?: any;
}