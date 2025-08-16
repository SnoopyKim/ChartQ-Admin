"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import Icon from "@/components/ui/icon";
import {
  DashboardStats,
  StudyStatsDetailed,
  UserTypeStats,
  DailyStudyStats,
} from "@/types/study-analytics";
import {
  getDashboardStats,
  getStudyStatsDetailed,
} from "@/services/study-analytics";

interface AnalyticsOverviewProps {
  className?: string;
}

export function AnalyticsOverview({ className = "" }: AnalyticsOverviewProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [studyStats, setStudyStats] = useState<StudyStatsDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardResult, studyStatsResult] = await Promise.all([
          getDashboardStats(),
          getStudyStatsDetailed(),
        ]);

        if (dashboardResult.error) {
          setError("대시보드 통계를 가져오는데 실패했습니다.");
          return;
        }

        if (studyStatsResult.error) {
          setError("스터디 통계를 가져오는데 실패했습니다.");
          return;
        }

        setDashboardStats(dashboardResult.data!);
        setStudyStats(studyStatsResult.data!);
      } catch (err) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="text-center">
          <p className="text-gray-600">통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardStats) {
    return (
      <div className={`${className} p-8`}>
        <div className="text-center text-red-600">
          <p>{error || "데이터를 불러올 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          스터디 조회 통계
        </h3>
        <p className="text-gray-600">
          사용자들의 스터디 이용 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
            <Icon name="eye" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              최근 7일: {dashboardStats.viewsLast7Days.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Icon name="users" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalUniqueUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">누적 고유 사용자 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 스터디</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalStudies}
            </div>
            <p className="text-xs text-muted-foreground">등록된 차트자료 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">프리미엄 비율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalViews > 0
                ? Math.round(
                    (dashboardStats.premiumViews / dashboardStats.totalViews) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">프리미엄 조회 비율</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="top-studies">인기 스터디</TabsTrigger>
          <TabsTrigger value="user-types">사용자 타입별</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 최근 30일 vs 7일 비교 */}
          <Card>
            <CardHeader>
              <CardTitle>기간별 조회 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">최근 30일</span>
                    <Badge variant="secondary">
                      {dashboardStats.viewsLast30Days.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">최근 7일</span>
                    <Badge variant="secondary">
                      {dashboardStats.viewsLast7Days.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width:
                          dashboardStats.viewsLast30Days > 0
                            ? `${
                                (dashboardStats.viewsLast7Days /
                                  dashboardStats.viewsLast30Days) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 프리미엄 vs 무료 */}
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 타입별 조회 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      프리미엄
                    </span>
                    <Badge variant="secondary">
                      {dashboardStats.premiumViews.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width:
                          dashboardStats.totalViews > 0
                            ? `${
                                (dashboardStats.premiumViews /
                                  dashboardStats.totalViews) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      무료
                    </span>
                    <Badge variant="secondary">
                      {dashboardStats.freeViews.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width:
                          dashboardStats.totalViews > 0
                            ? `${
                                (dashboardStats.freeViews /
                                  dashboardStats.totalViews) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-studies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>인기 스터디 TOP 10 (최근 30일)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.topStudies.slice(0, 10).map((study, index) => (
                  <div
                    key={study.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{study.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {study.is_premium && (
                            <Badge variant="secondary" className="text-xs">
                              프리미엄
                            </Badge>
                          )}
                          <span>고유 사용자: {study.unique_users_30_days}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {study.views_30_days.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">조회수</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>사용자 타입별 이용 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.userTypeBreakdown.map((userType) => (
                  <div key={userType.user_type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Badge
                          variant={
                            userType.user_type === "PRO"
                              ? "default"
                              : userType.user_type === "PLUS"
                              ? "secondary"
                              : userType.user_type === "BASIC"
                              ? "outline"
                              : "error"
                          }
                        >
                          {userType.user_type}
                        </Badge>
                        <span>사용자: {userType.unique_users}명</span>
                      </span>
                      <Badge variant="secondary">
                        {userType.total_views.toLocaleString()} 조회
                      </Badge>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          userType.user_type === "PRO"
                            ? "bg-purple-600"
                            : userType.user_type === "PLUS"
                            ? "bg-blue-600"
                            : userType.user_type === "BASIC"
                            ? "bg-green-600"
                            : "bg-gray-600"
                        }`}
                        style={{
                          width:
                            dashboardStats.totalViews > 0
                              ? `${
                                  (userType.total_views /
                                    dashboardStats.totalViews) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        평균 일일 조회: {userType.avg_views_per_day.toFixed(1)}
                      </span>
                      <span>
                        조회한 스터디: {userType.unique_studies_viewed}개
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
