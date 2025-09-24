"use client";

import { useState, useEffect } from "react";
import { SurveyQuestion, QuestionForm as QuestionFormType, OptionForm } from "@/types/survey";
import { createQuestion, updateQuestion } from "@/services/survey";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Label } from "@/components/shadcn/label";
import { Switch } from "@/components/shadcn/switch";
import { Plus, Trash2 } from "lucide-react";

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingQuestion?: SurveyQuestion | null;
}

export default function QuestionForm({
  isOpen,
  onClose,
  onSuccess,
  editingQuestion,
}: QuestionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuestionFormType>({
    question_text: "",
    question_description: "",
    is_active: true,
  });
  const [options, setOptions] = useState<OptionForm[]>([
    { option_text: "", option_value: "", is_active: true },
  ]);

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        question_text: editingQuestion.question_text,
        question_description: editingQuestion.question_description || "",
        is_active: editingQuestion.is_active,
      });
      if (editingQuestion.options && editingQuestion.options.length > 0) {
        setOptions(
          editingQuestion.options.map((opt) => ({
            option_text: opt.option_text,
            option_value: opt.option_value,
            is_active: opt.is_active,
          }))
        );
      } else {
        setOptions([{ option_text: "", option_value: "", is_active: true }]);
      }
    } else {
      setFormData({ question_text: "", question_description: "", is_active: true });
      setOptions([{ option_text: "", option_value: "", is_active: true }]);
    }
  }, [editingQuestion, isOpen]);

  const addOption = () => {
    setOptions([...options, { option_text: "", option_value: "", is_active: true }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: keyof OptionForm, value: string | boolean) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!formData.question_text.trim()) {
      toast({
        title: "입력 오류",
        description: "질문을 입력해주세요.",
        variant: "error",
      });
      return;
    }

    const validOptions = options.filter(
      (opt) => opt.option_text.trim() && opt.option_value.trim()
    );

    if (!editingQuestion && validOptions.length === 0) {
      toast({
        title: "입력 오류",
        description: "최소 1개 이상의 선택지를 입력해주세요.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingQuestion) {
        const { error } = await updateQuestion(editingQuestion.id, formData);
        if (error) throw error;
        
        toast({
          title: "수정 완료",
          description: "질문이 성공적으로 수정되었습니다.",
        });
      } else {
        const { error } = await createQuestion(formData, validOptions);
        if (error) throw error;
        
        toast({
          title: "생성 완료",
          description: "새 질문이 성공적으로 생성되었습니다.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: editingQuestion ? "수정 실패" : "생성 실패",
        description: "질문 처리 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? "질문 수정" : "새 질문 추가"}
          </DialogTitle>
          <DialogDescription>
            {editingQuestion
              ? "기존 질문을 수정합니다. 선택지는 별도로 관리해주세요."
              : "새 설문조사 질문과 선택지를 추가합니다."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question_text">질문</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) =>
                setFormData({ ...formData, question_text: e.target.value })
              }
              placeholder="예: 차트큐를 어떻게 알게 되셨나요?&#10;궁금한 내용을 자세히 적어주세요."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question_description">질문 설명 (선택사항)</Label>
            <Textarea
              id="question_description"
              value={formData.question_description}
              onChange={(e) =>
                setFormData({ ...formData, question_description: e.target.value })
              }
              placeholder="질문에 대한 부가 설명이나 안내사항을 입력하세요."
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">질문 활성화</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          {!editingQuestion && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>선택지</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  선택지 추가
                </Button>
              </div>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="선택지 텍스트"
                      value={option.option_text}
                      onChange={(e) =>
                        updateOption(index, "option_text", e.target.value)
                      }
                    />
                    <Input
                      placeholder="값 (영문)"
                      value={option.option_value}
                      onChange={(e) =>
                        updateOption(index, "option_value", e.target.value)
                      }
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={options.length === 1}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "처리중..."
              : editingQuestion
              ? "수정하기"
              : "추가하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}