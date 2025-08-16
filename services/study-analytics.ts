import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import {
  StudyStatsDetailed,
  DailyStudyStats,
  UserTypeStats,
  MonthlyStats,
  PopularStudy,
  DashboardStats,
  StudyAnalyticsResponse,
  StudyViewCount,
} from "@/types/study-analytics";

const supabase = createClient();

// 스터디별 상세 통계 조회
export async function getStudyStatsDetailed(): Promise<
  StudyAnalyticsResponse<StudyStatsDetailed[]>
> {
  try {
    const { data, error } = await supabase
      .from("study_stats_detailed")
      .select("*")
      .order("total_views", { ascending: false });

    if (error) {
      console.error("Error fetching study stats:", error);
      return { error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getStudyStatsDetailed:", error);
    return { error };
  }
}

// 특정 스터디의 상세 통계 조회
export async function getStudyStatsById(
  studyId: string
): Promise<StudyAnalyticsResponse<StudyStatsDetailed>> {
  try {
    const { data, error } = await supabase
      .from("study_stats_detailed")
      .select("*")
      .eq("id", studyId)
      .single();

    if (error) {
      console.error("Error fetching study stats by id:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Error in getStudyStatsById:", error);
    return { error };
  }
}

// 일별 통계 조회 (기간 필터 가능)
export async function getDailyStudyStats(
  startDate?: string,
  endDate?: string,
  studyId?: string
): Promise<StudyAnalyticsResponse<DailyStudyStats[]>> {
  try {
    let query = supabase.from("daily_study_stats").select("*");

    if (startDate) {
      query = query.gte("date", startDate);
    }

    if (endDate) {
      query = query.lte("date", endDate);
    }

    if (studyId) {
      query = query.eq("study_id", studyId);
    }

    const { data, error } = await query
      .order("date", { ascending: false })
      .order("daily_views", { ascending: false });

    if (error) {
      console.error("Error fetching daily stats:", error);
      return { error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getDailyStudyStats:", error);
    return { error };
  }
}

// 사용자 타입별 통계 조회
export async function getUserTypeStats(): Promise<
  StudyAnalyticsResponse<UserTypeStats[]>
> {
  try {
    const { data, error } = await supabase
      .from("user_type_stats")
      .select("*")
      .order("total_views", { ascending: false });

    if (error) {
      console.error("Error fetching user type stats:", error);
      return { error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getUserTypeStats:", error);
    return { error };
  }
}

// 월별 통계 조회
export async function getMonthlyStats(
  limit: number = 12
): Promise<StudyAnalyticsResponse<MonthlyStats[]>> {
  try {
    const { data, error } = await supabase
      .from("monthly_stats")
      .select("*")
      .order("month", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching monthly stats:", error);
      return { error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getMonthlyStats:", error);
    return { error };
  }
}

// 인기 스터디 TOP 10 (최근 30일)
export async function getPopularStudies(): Promise<
  StudyAnalyticsResponse<PopularStudy[]>
> {
  try {
    const { data, error } = await supabase
      .from("popular_studies_30_days")
      .select("*");

    if (error) {
      console.error("Error fetching popular studies:", error);
      return { error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getPopularStudies:", error);
    return { error };
  }
}

// 스터디별 조회수 (Flutter 앱용)
export async function getStudyViewCounts(): Promise<
  StudyAnalyticsResponse<StudyViewCount[]>
> {
  try {
    const { data, error } = await supabase
      .from("study_view_counts")
      .select("*");

    if (error) {
      console.error("Error fetching study view counts:", error);
      return { error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Error in getStudyViewCounts:", error);
    return { error };
  }
}

// 대시보드 통계 요약 (여러 API 호출을 통합)
export async function getDashboardStats(): Promise<
  StudyAnalyticsResponse<DashboardStats>
> {
  try {
    // 병렬로 여러 통계 데이터를 가져옴
    const [
      studyStatsResult,
      userTypeStatsResult,
      popularStudiesResult,
      recentDailyStatsResult,
      monthlyStatsResult,
    ] = await Promise.all([
      getStudyStatsDetailed(),
      getUserTypeStats(),
      getPopularStudies(),
      getDailyStudyStats(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 7일 전
        new Date().toISOString().split("T")[0] // 오늘
      ),
      getMonthlyStats(1), // 현재 월만
    ]);

    // 에러 처리
    if (studyStatsResult.error) return { error: studyStatsResult.error };
    if (userTypeStatsResult.error) return { error: userTypeStatsResult.error };
    if (popularStudiesResult.error)
      return { error: popularStudiesResult.error };

    const studyStats = studyStatsResult.data || [];
    const userTypeStats = userTypeStatsResult.data || [];
    const popularStudies = popularStudiesResult.data || [];
    const recentDailyStats = recentDailyStatsResult.data || [];
    const monthlyStats = monthlyStatsResult.data || [];

    // 통합 통계 계산
    const totalViews = studyStats.reduce(
      (sum, study) => sum + study.total_views,
      0
    );
    const totalUniqueUsers = Math.max(
      ...studyStats.map((study) => study.unique_users),
      0
    );
    const totalStudies = studyStats.length;
    const premiumViews = studyStats
      .filter((study) => study.is_premium)
      .reduce((sum, study) => sum + study.total_views, 0);
    const freeViews = totalViews - premiumViews;
    const viewsLast7Days = studyStats.reduce(
      (sum, study) => sum + study.views_last_7_days,
      0
    );
    const viewsLast30Days = studyStats.reduce(
      (sum, study) => sum + study.views_last_30_days,
      0
    );

    const dashboardStats: DashboardStats = {
      totalViews,
      totalUniqueUsers,
      totalStudies,
      premiumViews,
      freeViews,
      viewsLast7Days,
      viewsLast30Days,
      topStudies: popularStudies.slice(0, 5), // 상위 5개만
      userTypeBreakdown: userTypeStats,
      recentDailyStats,
    };

    return { data: dashboardStats };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return { error };
  }
}

// 스터디 조회 기록 추가 (필요시 사용)
export async function addStudyAnalytics(
  userId: string,
  studyId: string,
  userType: "HOBBY" | "BASIC" | "PLUS" | "PRO"
): Promise<StudyAnalyticsResponse<boolean>> {
  try {
    const { error } = await supabase.from("study_analytics").insert({
      user_id: userId,
      study_id: studyId,
      user_type: userType,
      viewed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error adding study analytics:", error);
      return { error };
    }

    return { data: true };
  } catch (error) {
    console.error("Error in addStudyAnalytics:", error);
    return { error };
  }
}

// 특정 기간의 통계 요약
export async function getStatsSummary(
  startDate: string,
  endDate: string
): Promise<
  StudyAnalyticsResponse<{
    totalViews: number;
    uniqueUsers: number;
    topStudy: string;
    avgViewsPerDay: number;
  }>
> {
  try {
    const { data, error } = await supabase
      .from("study_analytics")
      .select("*")
      .gte("viewed_at", startDate)
      .lte("viewed_at", endDate);

    if (error) {
      console.error("Error fetching stats summary:", error);
      return { error };
    }

    if (!data || data.length === 0) {
      return {
        data: {
          totalViews: 0,
          uniqueUsers: 0,
          topStudy: "N/A",
          avgViewsPerDay: 0,
        },
      };
    }

    const totalViews = data.length;
    const uniqueUsers = new Set(data.map((record) => record.user_id)).size;

    // 가장 많이 조회된 스터디 찾기
    const studyViewCounts = data.reduce((acc, record) => {
      acc[record.study_id] = (acc[record.study_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topStudyId =
      Object.entries(studyViewCounts).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0]?.[0] || "N/A";

    // 일평균 조회수 계산
    const daysDiff = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const avgViewsPerDay = daysDiff > 0 ? totalViews / daysDiff : 0;

    return {
      data: {
        totalViews,
        uniqueUsers,
        topStudy: topStudyId,
        avgViewsPerDay: Math.round(avgViewsPerDay * 100) / 100,
      },
    };
  } catch (error) {
    console.error("Error in getStatsSummary:", error);
    return { error };
  }
}
