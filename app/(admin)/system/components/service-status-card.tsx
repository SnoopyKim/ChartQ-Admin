"use client";

import { useState } from "react";
import { Card } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { Switch } from "@/components/shadcn/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shadcn/dialog";
import { useToast } from "@/hooks/use-toast";
import { ServiceStatus } from "@/types/system";
import { toggleMaintenanceMode } from "@/services/system";
import { Settings, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ServiceStatusCardProps {
  serviceStatus: ServiceStatus | null;
  onStatusUpdate: () => void;
}

export default function ServiceStatusCard({ serviceStatus, onStatusUpdate }: ServiceStatusCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const { toast } = useToast();

  const isMaintenanceMode = serviceStatus?.is_maintenance_mode || false;

  const handleToggleMaintenance = async (enable: boolean) => {
    if (enable) {
      setIsDialogOpen(true);
      return;
    }

    // 점검 모드 해제
    setIsLoading(true);
    try {
      await toggleMaintenanceMode(false);
      toast({
        title: "점검 모드가 해제되었습니다",
        description: "서비스가 정상적으로 재개됩니다.",
      });
      onStatusUpdate();
    } catch (error) {
      toast({
        title: "점검 모드 해제 실패",
        description: "점검 모드 해제 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableMaintenance = async () => {
    setIsLoading(true);
    try {
      await toggleMaintenanceMode(true, maintenanceMessage);
      toast({
        title: "점검 모드가 활성화되었습니다",
        description: "사용자에게 점검 안내가 표시됩니다.",
      });
      setIsDialogOpen(false);
      setMaintenanceMessage("");
      onStatusUpdate();
    } catch (error) {
      toast({
        title: "점검 모드 활성화 실패",
        description: "점검 모드 활성화 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isMaintenanceMode) {
      return <AlertTriangle className="h-6 w-6 text-orange-500" />;
    }
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  };

  const getStatusText = () => {
    if (isMaintenanceMode) {
      return {
        title: "점검 모드",
        description: "현재 서비스가 점검 중입니다",
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      };
    }
    return {
      title: "정상 서비스",
      description: "모든 서비스가 정상 운영 중입니다",
      color: "text-green-600",
      bgColor: "bg-green-50"
    };
  };

  const status = getStatusText();

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">서비스 상태</h2>
        </div>

        <div className={`${status.bgColor} rounded-lg p-4 mb-4`}>
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <span className={`text-lg font-semibold ${status.color}`}>
              {status.title}
            </span>
          </div>
          <p className="text-sm text-gray-600">{status.description}</p>
        </div>

        {isMaintenanceMode && serviceStatus?.maintenance_message && (
          <div className="mb-4">
            <Label className="text-sm text-gray-600">점검 안내 메시지</Label>
            <p className="text-sm bg-gray-50 p-3 rounded-md mt-1">
              {serviceStatus.maintenance_message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Label className="text-sm font-medium">점검 모드</Label>
            <p className="text-xs text-gray-500">
              활성화 시 사용자에게 점검 안내가 표시됩니다
            </p>
          </div>
          <Switch
            checked={isMaintenanceMode}
            onCheckedChange={handleToggleMaintenance}
            disabled={isLoading}
          />
        </div>

        {serviceStatus && (
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            마지막 업데이트: {new Date(serviceStatus.updated_at).toLocaleString("ko-KR")}
          </div>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <DialogTitle>점검 모드 활성화</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="maintenance_message">점검 안내 메시지</Label>
              <Textarea
                id="maintenance_message"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="사용자에게 표시될 점검 안내 메시지를 입력하세요..."
                rows={3}
              />
            </div>

            <div className="bg-orange-50 p-3 rounded-md">
              <p className="text-sm text-orange-800">
                <strong>주의:</strong> 점검 모드가 활성화되면 모든 사용자에게 점검 안내가 표시됩니다.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button 
              onClick={handleEnableMaintenance}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "활성화 중..." : "점검 모드 활성화"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}