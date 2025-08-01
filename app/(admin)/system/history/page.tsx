"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getVersionHistory } from "@/services/system";
import { AppVersion } from "@/types/system";
import { Card } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { ArrowLeft, Package, Calendar, CheckCircle, Clock } from "lucide-react";

export default function VersionHistoryPage() {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchVersionHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getVersionHistory();
        setVersions(data);
      } catch (error) {
        toast({
          title: "데이터 로딩 실패",
          description: "버전 히스토리를 불러오는 중 오류가 발생했습니다.",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersionHistory();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Button>
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">버전 히스토리</h1>
            <p className="text-gray-600">앱 버전 배포 이력을 확인합니다</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : versions.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">버전 히스토리가 없습니다</h3>
          <p className="text-gray-500">아직 배포된 버전이 없습니다.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <Card key={version.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">
                      v{version.latest_version}
                    </span>
                    {version.is_active && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        현재 활성
                      </Badge>
                    )}
                    {index === 0 && !version.is_active && (
                      <Badge variant="outline" className="text-gray-600">
                        최신
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(version.created_at)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">최소 지원 버전</span>
                  <p className="text-sm text-orange-600 font-semibold">
                    v{version.minimum_version}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">배포 시각</span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="h-3 w-3" />
                    {formatDate(version.updated_at)}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600 block mb-2">
                  릴리즈 노트
                </span>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {version.release_notes}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}