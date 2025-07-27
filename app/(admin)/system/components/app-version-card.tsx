"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn/dialog";
import { useToast } from "@/hooks/use-toast";
import { AppVersion, AppVersionForm } from "@/types/system";
import { createNewVersion } from "@/services/system";
import { Package, Rocket, History } from "lucide-react";

interface AppVersionCardProps {
  currentVersion: AppVersion | null;
  onVersionUpdate: () => void;
}

export default function AppVersionCard({
  currentVersion,
  onVersionUpdate,
}: AppVersionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AppVersionForm>({
    latest_version: "",
    minimum_version: "",
    release_notes: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createNewVersion(formData);
      toast({
        title: "새 버전이 배포되었습니다",
        description: `버전 ${formData.latest_version}이 성공적으로 활성화되었습니다.`,
      });
      setIsDialogOpen(false);
      setFormData({
        latest_version: "",
        minimum_version: "",
        release_notes: "",
      });
      onVersionUpdate();
    } catch (error) {
      toast({
        title: "버전 배포 실패",
        description: "새 버전 배포 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">앱 버전 관리</h2>
        </div>

        {currentVersion ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">최신 버전</Label>
                <p className="text-lg font-semibold text-green-600">
                  v{currentVersion.latest_version}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">최소 지원 버전</Label>
                <p className="text-lg font-semibold text-orange-600">
                  v{currentVersion.minimum_version}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">릴리즈 노트</Label>
              <p className="text-sm bg-gray-50 p-3 rounded-md mt-1">
                {currentVersion.release_notes}
              </p>
            </div>

            <div className="text-xs text-gray-500">
              마지막 업데이트:{" "}
              {new Date(currentVersion.updated_at).toLocaleString("ko-KR")}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            버전 정보를 불러올 수 없습니다.
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Rocket className="h-4 w-4" />새 버전 배포
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push("/system/history")}
          >
            <History className="h-4 w-4" />
            버전 히스토리
          </Button>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>새 버전 배포</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="latest_version">최신 버전</Label>
              <Input
                id="latest_version"
                value={formData.latest_version}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    latest_version: e.target.value,
                  }))
                }
                placeholder="예: 1.2.0"
                required
              />
            </div>

            <div>
              <Label htmlFor="minimum_version">최소 지원 버전</Label>
              <Input
                id="minimum_version"
                value={formData.minimum_version}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minimum_version: e.target.value,
                  }))
                }
                placeholder="예: 1.1.0"
                required
              />
            </div>

            <div>
              <Label htmlFor="release_notes">릴리즈 노트</Label>
              <Textarea
                id="release_notes"
                value={formData.release_notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    release_notes: e.target.value,
                  }))
                }
                placeholder="이번 업데이트의 주요 변경사항을 입력하세요..."
                rows={3}
                required
              />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "배포 중..." : "배포하기"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
