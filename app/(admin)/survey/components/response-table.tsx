"use client";

import { SurveyResponse } from "@/types/survey";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";

interface ResponseTableProps {
  responses: SurveyResponse[];
}

export default function ResponseTable({ responses }: ResponseTableProps) {
  if (responses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">
            아직 응답 내역이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 응답 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>응답 시간</TableHead>
              <TableHead>사용자</TableHead>
              <TableHead>질문</TableHead>
              <TableHead>선택한 답변</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell className="text-sm">
                  {new Date(response.created_at).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {response.user?.email || "알 수 없음"}
                    </p>
                    {response.user?.created_at && (
                      <p className="text-xs text-gray-500">
                        가입: {new Date(response.user.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm max-w-xs truncate">
                    {response.question?.question_text || "삭제된 질문"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {response.option?.option_text || "삭제된 선택지"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}