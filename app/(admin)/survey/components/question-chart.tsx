"use client";

import { QuestionWithStats } from "@/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { Badge } from "@/components/shadcn/badge";

interface QuestionChartProps {
  questionStat: QuestionWithStats;
}

export default function QuestionChart({ questionStat }: QuestionChartProps) {
  const { question, total_responses, options_stats } = questionStat;
  
  // Find the most selected option
  const mostSelected = options_stats.reduce((prev, current) => 
    current.response_count > prev.response_count ? current : prev
  , options_stats[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{question.question_text}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              총 {total_responses}개 응답
            </p>
          </div>
          {!question.is_active && (
            <Badge variant="secondary">비활성</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {options_stats.map((optionStat) => {
            const isMostSelected = mostSelected && optionStat.option.id === mostSelected.option.id;
            
            return (
              <div key={optionStat.option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isMostSelected ? 'text-blue-600' : ''}`}>
                      {optionStat.option.option_text}
                    </span>
                    {isMostSelected && (
                      <Badge variant="default" className="text-xs">
                        최다 선택
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{optionStat.response_count}명</span>
                    <span className="font-medium">{optionStat.percentage}%</span>
                  </div>
                </div>
                <Progress 
                  value={optionStat.percentage} 
                  className={`h-2 ${isMostSelected ? 'bg-blue-100' : ''}`}
                />
              </div>
            );
          })}

          {options_stats.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              아직 응답이 없습니다
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}