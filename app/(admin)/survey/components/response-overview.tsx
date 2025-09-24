"use client";

import { SurveyAnalytics } from "@/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Users, CheckCircle, TrendingUp, MessageSquare } from "lucide-react";

interface ResponseOverviewProps {
  analytics: SurveyAnalytics;
}

export default function ResponseOverview({ analytics }: ResponseOverviewProps) {
  const stats = [
    {
      title: "전체 사용자",
      value: analytics.total_users.toLocaleString(),
      icon: Users,
      description: "등록된 사용자 수",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "응답 완료",
      value: analytics.total_responses.toLocaleString(),
      icon: CheckCircle,
      description: "설문조사 완료 사용자",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "응답률",
      value: `${analytics.response_rate}%`,
      icon: TrendingUp,
      description: "전체 대비 응답 비율",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "활성 질문",
      value: analytics.questions_with_stats.filter(q => q.question.is_active).length.toString(),
      icon: MessageSquare,
      description: "현재 활성화된 질문",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}