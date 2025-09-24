"use client";

import { useState } from "react";
import { SurveyOption, OptionForm } from "@/types/survey";
import {
  createOption,
  updateOption,
  deleteOption,
  reorderOptions,
} from "@/services/survey";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Switch } from "@/components/shadcn/switch";
import {
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  Plus,
  Check,
  X,
} from "lucide-react";

interface OptionManagerProps {
  questionId: string;
  options: SurveyOption[];
  onOptionsChange: (newOptions: SurveyOption[]) => void;
}

export default function OptionManager({
  questionId,
  options,
  onOptionsChange,
}: OptionManagerProps) {
  const { toast } = useToast();
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<OptionForm>({
    option_text: "",
    option_value: "",
    is_active: true,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOptionData, setNewOptionData] = useState<OptionForm>({
    option_text: "",
    option_value: "",
    is_active: true,
  });

  const handleReorder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === options.length - 1)
    ) {
      return;
    }

    const newOptions = [...options];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    // Swap the options
    [newOptions[index], newOptions[swapIndex]] = [
      newOptions[swapIndex],
      newOptions[index],
    ];

    // Update order numbers for optimistic update
    const optimisticOptions = newOptions.map((o, idx) => ({
      ...o,
      option_order: idx + 1,
    }));

    // Optimistic update
    onOptionsChange(optimisticOptions);

    // Update order numbers for API
    const reorderedOptions = newOptions.map((o, idx) => ({
      id: o.id,
      option_order: idx + 1,
    }));

    try {
      const { success, error } = await reorderOptions(reorderedOptions);
      if (error) throw error;

      if (success) {
        toast({
          title: "순서 변경 완료",
          description: "선택지 순서가 성공적으로 변경되었습니다.",
        });
      }
    } catch (error) {
      // Rollback - refetch original data
      onOptionsChange(options);
      toast({
        title: "순서 변경 실패",
        description: "선택지 순서 변경 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  const handleEdit = (option: SurveyOption) => {
    setEditingOption(option.id);
    setEditFormData({
      option_text: option.option_text,
      option_value: option.option_value,
      is_active: option.is_active,
    });
  };

  const handleSaveEdit = async (optionId: string) => {
    const originalOptions = [...options];
    
    // Optimistic update
    const updatedOptions = options.map(opt => 
      opt.id === optionId 
        ? { ...opt, ...editFormData, updated_at: new Date().toISOString() }
        : opt
    );
    onOptionsChange(updatedOptions);
    setEditingOption(null);

    try {
      const { error } = await updateOption(optionId, editFormData);
      if (error) throw error;

      toast({
        title: "수정 완료",
        description: "선택지가 성공적으로 수정되었습니다.",
      });
    } catch (error) {
      // Rollback
      onOptionsChange(originalOptions);
      setEditingOption(optionId);
      toast({
        title: "수정 실패",
        description: "선택지 수정 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingOption(null);
    setEditFormData({ option_text: "", option_value: "", is_active: true });
  };

  const handleDelete = async (optionId: string) => {
    if (!confirm("이 선택지를 삭제하시겠습니까?")) {
      return;
    }

    const originalOptions = [...options];
    
    // Optimistic update
    const filteredOptions = options.filter(opt => opt.id !== optionId);
    onOptionsChange(filteredOptions);

    try {
      const { success, error } = await deleteOption(optionId);
      if (error) throw error;

      if (success) {
        toast({
          title: "삭제 완료",
          description: "선택지가 성공적으로 삭제되었습니다.",
        });
      }
    } catch (error) {
      // Rollback
      onOptionsChange(originalOptions);
      toast({
        title: "삭제 실패",
        description: "선택지 삭제 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  const handleAddNew = async () => {
    if (
      !newOptionData.option_text.trim() ||
      !newOptionData.option_value.trim()
    ) {
      toast({
        title: "입력 오류",
        description: "선택지 텍스트와 값을 모두 입력해주세요.",
        variant: "error",
      });
      return;
    }

    const originalOptions = [...options];
    
    // Create temporary option for optimistic update
    const tempOption: SurveyOption = {
      id: `temp_${Date.now()}`,
      question_id: questionId,
      option_text: newOptionData.option_text,
      option_value: newOptionData.option_value,
      option_order: options.length + 1,
      is_active: newOptionData.is_active || true,
      created_at: new Date().toISOString(),
    };
    
    // Optimistic update
    onOptionsChange([...options, tempOption]);
    setIsAddingNew(false);
    setNewOptionData({ option_text: "", option_value: "", is_active: true });

    try {
      const { error } = await createOption(questionId, newOptionData);
      if (error) throw error;

      toast({
        title: "추가 완료",
        description: "새 선택지가 성공적으로 추가되었습니다.",
      });
      
      // Refresh to get real ID from server
      // But this won't close the card since we're not calling the parent's onQuestionsChange
    } catch (error) {
      // Rollback
      onOptionsChange(originalOptions);
      setIsAddingNew(true);
      setNewOptionData(newOptionData);
      toast({
        title: "추가 실패",
        description: "선택지 추가 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  const handleToggleActive = async (option: SurveyOption) => {
    const originalOptions = [...options];
    
    // Optimistic update
    const updatedOptions = options.map(opt => 
      opt.id === option.id 
        ? { ...opt, is_active: !opt.is_active }
        : opt
    );
    onOptionsChange(updatedOptions);

    try {
      const { error } = await updateOption(option.id, {
        is_active: !option.is_active,
      });
      if (error) throw error;

      toast({
        title: "상태 변경 완료",
        description: `선택지가 ${
          !option.is_active ? "활성화" : "비활성화"
        }되었습니다.`,
      });
    } catch (error) {
      // Rollback
      onOptionsChange(originalOptions);
      toast({
        title: "상태 변경 실패",
        description: "선택지 상태 변경 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">선택지 목록</h4>
        {!isAddingNew && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            선택지 추가
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
              !option.is_active ? "opacity-60" : ""
            }`}
          >
            <span className="text-sm font-medium text-gray-500 w-8">
              {option.option_order || index + 1}
            </span>

            {editingOption === option.id ? (
              <>
                <Input
                  value={editFormData.option_text}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      option_text: e.target.value,
                    })
                  }
                  placeholder="선택지 텍스트"
                  className="flex-1"
                />
                <Input
                  value={editFormData.option_value}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      option_value: e.target.value,
                    })
                  }
                  placeholder="값"
                  className="w-32"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveEdit(option.id)}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{option.option_text}</span>
                <span className="text-sm text-gray-500 w-24">
                  ({option.option_value})
                </span>
                <Switch
                  checked={option.is_active}
                  onCheckedChange={() => handleToggleActive(option)}
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(index, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(index, "down")}
                    disabled={index === options.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(option)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(option.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {isAddingNew && (
          <div className="flex items-center gap-2 p-2 rounded-md border border-blue-300 bg-blue-50">
            <span className="text-sm font-medium text-gray-500 w-8">새</span>
            <Input
              value={newOptionData.option_text}
              onChange={(e) =>
                setNewOptionData({
                  ...newOptionData,
                  option_text: e.target.value,
                })
              }
              placeholder="선택지 텍스트"
              className="flex-1"
            />
            <Input
              value={newOptionData.option_value}
              onChange={(e) =>
                setNewOptionData({
                  ...newOptionData,
                  option_value: e.target.value,
                })
              }
              placeholder="값 (영문)"
              className="w-32"
            />
            <Button variant="ghost" size="sm" onClick={handleAddNew}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingNew(false);
                setNewOptionData({
                  option_text: "",
                  option_value: "",
                  is_active: true,
                });
              }}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
