"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSurveyOverviewStats, getSurveyOptionSummaries } from "@/services/survey";
import { SurveyOverviewStats, SurveyOptionSummary } from "@/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Badge } from "@/components/shadcn/badge";
import { Users, CheckCircle, TrendingUp, MessageSquare, RefreshCw, Crown } from "lucide-react";

interface SurveyStatsDashboardProps {
  onRefresh?: () => void;
}

export default function SurveyStatsDashboard({ onRefresh }: SurveyStatsDashboardProps) {
  const [overview, setOverview] = useState<SurveyOverviewStats | null>(null);
  const [optionSummaries, setOptionSummaries] = useState<SurveyOptionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [overviewResult, summariesResult] = await Promise.all([
        getSurveyOverviewStats(),
        getSurveyOptionSummaries(),
      ]);

      if (overviewResult.error) throw overviewResult.error;
      if (summariesResult.error) throw summariesResult.error;

      setOverview(overviewResult.data || null);
      setOptionSummaries(summariesResult.data || []);
    } catch (error) {
      toast({
        title: "데이터 로딩 실패",
        description: "통계 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group option summaries by question
  const questionGroups = optionSummaries.reduce((acc, summary) => {
    if (!acc[summary.question_id]) {
      acc[summary.question_id] = {
        question: {
          id: summary.question_id,
          text: summary.question_text,
          order: summary.question_order,
          active: summary.question_active,
        },
        options: [],
        totalResponses: summary.question_total_responses,
      };
    }
    acc[summary.question_id].options.push({
      id: summary.option_id,
      text: summary.option_text,
      value: summary.option_value,
      order: summary.option_order,
      active: summary.option_active,
      responseCount: summary.response_count,
      percentage: summary.percentage,
    });
    return acc;
  }, {} as Record<string, any>);

  const questions = Object.values(questionGroups).sort((a: any, b: any) => a.question.order - b.question.order);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          통계 데이터가 없습니다
        </h3>
        <p className="text-gray-600">
          설문조사 응답이 있어야 통계를 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: "전체 사용자",
      value: overview.total_users.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "응답 완료",
      value: overview.total_responses.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "응답률",
      value: `${overview.response_rate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "활성 질문",
      value: overview.active_questions.toString(),
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Question-wise Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">질문별 응답 분포</h3>
        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">아직 활성화된 질문이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((questionGroup: any) => {
            const mostSelected = questionGroup.options.reduce((prev: any, current: any) => 
              current.responseCount > prev.responseCount ? current : prev
            , questionGroup.options[0]);

            return (
              <Card key={questionGroup.question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {questionGroup.question.order}. {questionGroup.question.text}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        총 {questionGroup.totalResponses}개 응답
                      </p>
                    </div>
                    {!questionGroup.question.active && (
                      <Badge variant="secondary">비활성</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questionGroup.options.map((option: any) => {
                      const isMostSelected = mostSelected && option.id === mostSelected.id;
                      
                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isMostSelected ? 'font-semibold text-blue-600' : ''}`}>
                                {option.text}
                              </span>
                              {isMostSelected && option.responseCount > 0 && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">{option.responseCount}명</span>
                              <span className={`font-medium ${isMostSelected ? 'text-blue-600' : ''}`}>
                                {option.percentage}%
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={option.percentage} 
                            className={`h-2 ${isMostSelected ? 'bg-blue-100' : ''}`}
                          />
                        </div>
                      );
                    })}

                    {questionGroup.options.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        활성화된 선택지가 없습니다.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}