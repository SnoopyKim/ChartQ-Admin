"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Badge } from "@/components/shadcn/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  getAllCommunityChannels,
  createCommunityChannel,
  updateCommunityChannel,
  deleteCommunityChannel,
  toggleCommunityChannelActive,
  updateCommunityChannelOrder,
} from "@/services/system";
import { CommunityChannel, CommunityChannelForm } from "@/types/system";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  MessageCircle,
  ExternalLink,
  Users,
  GripVertical,
} from "lucide-react";
import { Card } from "@/components/shadcn/card";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CommunityChannelCardProps {
  onUpdate: () => void;
}

export default function CommunityChannelCard({
  onUpdate,
}: CommunityChannelCardProps) {
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<CommunityChannel | null>(
    null
  );
  const [formData, setFormData] = useState<CommunityChannelForm>({
    name: "",
    url: "",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // dnd-kit 센서
  const sensors = useSensors(useSensor(PointerSensor));

  const fetchChannels = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCommunityChannels();
      setChannels(data || []);
    } catch (error) {
      toast({
        title: "데이터 로딩 실패",
        description: "커뮤니티 채널 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", url: "", icon: "" });
    setEditingChannel(null);
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast({
        title: "입력 오류",
        description: "채널명과 URL을 모두 입력해주세요.",
        variant: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createCommunityChannel(formData);

      toast({
        title: "채널 생성 완료",
        description: "새 커뮤니티 채널이 생성되었습니다.",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchChannels();
      onUpdate();
    } catch (error) {
      toast({
        title: "채널 생성 실패",
        description: "채널 생성 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingChannel || !formData.name.trim() || !formData.url.trim()) {
      toast({
        title: "입력 오류",
        description: "채널명과 URL을 모두 입력해주세요.",
        variant: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateCommunityChannel(editingChannel.id, formData);

      toast({
        title: "채널 수정 완료",
        description: "커뮤니티 채널이 수정되었습니다.",
      });

      setIsEditDialogOpen(false);
      resetForm();
      fetchChannels();
      onUpdate();
    } catch (error) {
      toast({
        title: "채널 수정 실패",
        description: "채널 수정 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCommunityChannel(id);

      toast({
        title: "채널 삭제 완료",
        description: "커뮤니티 채널이 삭제되었습니다.",
      });

      fetchChannels();
      onUpdate();
    } catch (error) {
      toast({
        title: "채널 삭제 실패",
        description: "채널 삭제 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await toggleCommunityChannelActive(id, !isActive);

      toast({
        title: `채널 ${!isActive ? "활성화" : "비활성화"} 완료`,
        description: `커뮤니티 채널이 ${
          !isActive ? "활성화" : "비활성화"
        }되었습니다.`,
      });

      fetchChannels();
      onUpdate();
    } catch (error) {
      toast({
        title: "상태 변경 실패",
        description: "채널 상태 변경 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  // 드래그 종료 시 순서 변경 처리
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 현재 배열 복제 후, movedItem을 newIndex 위치로 이동
    const items = [...orderedChannels];
    const oldIndex = items.findIndex((c) => c.id === active.id);
    const newIndex = items.findIndex((c) => c.id === over.id);
    const [movedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, movedItem);

    // newIndex 기준으로 "이전 아이템" / "다음 아이템" 조회
    const prevItem = items[newIndex - 1];
    const nextItem = items[newIndex + 1];

    let newOrder: number;
    if (!prevItem) {
      // 맨 앞에 놓인 경우 → 다음 아이템 order / 2
      newOrder = nextItem ? nextItem.order_index / 2 : 1;
    } else if (!nextItem) {
      // 맨 뒤에 놓인 경우 → 이전 아이템 order + 1
      newOrder = prevItem.order_index + 1;
    } else {
      // 사이에 끼워넣는 경우 → (prev + next) / 2
      newOrder = (prevItem.order_index + nextItem.order_index) / 2;
    }

    // 드래그된 아이템의 order 갱신
    movedItem.order_index = newOrder;

    try {
      await updateCommunityChannelOrder(movedItem.id, newOrder);
      
      // 최종 배열로 상태 업데이트
      setChannels(items);
      
      toast({
        title: "순서 변경 완료",
        description: "채널 순서가 변경되었습니다.",
      });
      
      onUpdate();
    } catch (error) {
      toast({
        title: "순서 변경 실패",
        description: "순서 변경 중 오류가 발생했습니다.",
        variant: "error",
      });
      fetchChannels(); // 실패 시 원래 상태로 복구
    }
  };

  const openEditDialog = (channel: CommunityChannel) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      url: channel.url,
      icon: channel.icon || "",
    });
    setIsEditDialogOpen(true);
  };

  const orderedChannels = channels.sort((a, b) => a.order_index - b.order_index);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              커뮤니티 채널
            </h2>
            <p className="text-sm text-gray-600">
              앱에서 보여질 커뮤니티 채널 링크를 관리합니다. 드래그하여 순서를 변경할 수 있습니다.
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              채널 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 커뮤니티 채널 추가</DialogTitle>
              <DialogDescription>
                앱에서 사용자들이 접근할 수 있는 커뮤니티 채널을 추가합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="channel-name">채널명 *</Label>
                <Input
                  id="channel-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="예: 디스코드 커뮤니티"
                />
              </div>
              <div>
                <Label htmlFor="channel-url">URL *</Label>
                <Input
                  id="channel-url"
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://discord.gg/example"
                />
              </div>
              <div>
                <Label htmlFor="channel-icon">아이콘 (선택)</Label>
                <Input
                  id="channel-icon"
                  value={formData.icon || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="아이콘 URL 또는 이모지"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                취소
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "생성"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {channels.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            커뮤니티 채널이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            첫 번째 커뮤니티 채널을 추가해보세요.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            채널 추가
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={orderedChannels.map((channel) => channel.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {orderedChannels.map((channel) => (
                <SortableChannelItem
                  key={channel.id}
                  channel={channel}
                  onEdit={openEditDialog}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>커뮤니티 채널 수정</DialogTitle>
            <DialogDescription>채널 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-channel-name">채널명 *</Label>
              <Input
                id="edit-channel-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="예: 디스코드 커뮤니티"
              />
            </div>
            <div>
              <Label htmlFor="edit-channel-url">URL *</Label>
              <Input
                id="edit-channel-url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://discord.gg/example"
              />
            </div>
            <div>
              <Label htmlFor="edit-channel-icon">아이콘 (선택)</Label>
              <Input
                id="edit-channel-icon"
                value={formData.icon || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                placeholder="아이콘 URL 또는 이모지"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface SortableChannelItemProps {
  channel: CommunityChannel;
  onEdit: (channel: CommunityChannel) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
}

function SortableChannelItem({ channel, onEdit, onToggleActive, onDelete }: SortableChannelItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: channel.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
        isDragging ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          {channel.icon && (
            <span className="text-lg">{channel.icon}</span>
          )}
          <h3 className="font-medium text-gray-900 truncate">
            {channel.name}
          </h3>
          <Badge variant={channel.is_active ? "default" : "secondary"}>
            {channel.is_active ? "활성" : "비활성"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ExternalLink className="h-3 w-3" />
          <span className="truncate">{channel.url}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(channel)}>
            <Edit className="h-4 w-4 mr-2" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onToggleActive(channel.id, channel.is_active)}
          >
            {channel.is_active ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                비활성화
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                활성화
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>채널 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  &quot;{channel.name}&quot; 채널을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(channel.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
