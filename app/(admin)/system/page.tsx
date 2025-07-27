"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAppVersions, getServiceStatus } from "@/services/system";
import { AppVersion, ServiceStatus } from "@/types/system";
import AppVersionCard from "./components/app-version-card";
import ServiceStatusCard from "./components/service-status-card";
import { RefreshCw, Server } from "lucide-react";
import { Button } from "@/components/shadcn/button";

export default function SystemPage() {
  const [currentVersion, setCurrentVersion] = useState<AppVersion | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [versionData, statusData] = await Promise.all([
        getAppVersions(),
        getServiceStatus(),
      ]);
      
      setCurrentVersion(versionData);
      setServiceStatus(statusData);
    } catch (error) {
      toast({
        title: "데이터 로딩 실패",
        description: "시스템 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
    toast({
      title: "새로고침 완료",
      description: "시스템 정보가 업데이트되었습니다.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">시스템 관리</h1>
            <p className="text-gray-600">앱 버전과 서비스 상태를 관리합니다</p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppVersionCard
            currentVersion={currentVersion}
            onVersionUpdate={fetchData}
          />
          <ServiceStatusCard
            serviceStatus={serviceStatus}
            onStatusUpdate={fetchData}
          />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">시스템 관리 안내</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 새 버전 배포 시 기존 활성 버전은 자동으로 비활성화됩니다</li>
              <li>• 점검 모드 활성화 시 모든 사용자에게 점검 안내가 표시됩니다</li>
              <li>• 변경사항은 즉시 적용되므로 신중하게 진행해주세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}