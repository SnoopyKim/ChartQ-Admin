"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import ImageUploader from "@/components/ui/image-uploader";
import { QuizOX, QuizMC } from "@/types/quiz";
import { Label } from "@/components/shadcn/label";
import { useEffect, useState } from "react";
import Tag from "@/types/tag";
import { getTagList } from "@/services/tag";
import { Badge } from "@/components/shadcn/badge";
import { Switch } from "@/components/shadcn/switch";
import Icon from "@/components/ui/icon";
import { Textarea } from "@/components/shadcn/textarea";

export default function QuizOXForm({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: QuizOX;
  onSubmit: (data: {
    content: string;
    answer: boolean;
    tags: Partial<Tag>[];
    image?: File;
    explanation?: string;
  }) => Promise<void>;
}) {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Partial<Tag>[]>([]);
  const [answer, setAnswer] = useState<boolean>(true);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getTagList().then((res) => {
      if (res.error || !res.data) return;
      setTagList(res.data);
    });
  }, []);

  useEffect(() => {
    setSelectedTags(defaultValue?.tags ?? []);
    setAnswer(defaultValue?.answer ?? true);
  }, [defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("quiz-content") as string;
    const explanation = formData.get("quiz-explanation") as string;

    setIsSaving(true);
    await onSubmit({
      content,
      answer,
      tags: selectedTags,
      image: uploadedImage ?? undefined,
      explanation,
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quiz-content">문제</Label>
          <Input
            id="quiz-content"
            name="quiz-content"
            defaultValue={defaultValue?.content}
            placeholder="문제를 입력해주세요"
            className="mt-2 mb-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("quiz-explanation")?.focus();
              }
            }}
            required
          />
          <Label>
            태그{" "}
            <span className="text-sm text-primary">
              ({selectedTags.length}개)
            </span>
          </Label>
          <div className="flex gap-2 flex-wrap mt-2">
            {tagList.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  selectedTags.find((t) => t.id === tag.id)
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.some((t) => t.id === tag.id)
                      ? prev.filter((t) => t.id !== tag.id)
                      : [...prev, tag]
                  );
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 my-4">
            <Label htmlFor="quiz-answer">정답</Label>
            <Switch
              id="quiz-answer"
              name="quiz-answer"
              checked={answer}
              onCheckedChange={(checked) => {
                setAnswer(checked);
              }}
            />
            {answer ? (
              <span className="text-lg font-bold text-success">O</span>
            ) : (
              <span className="text-lg font-bold text-error">X</span>
            )}
          </div>
          <Label htmlFor="quiz-explanation">풀이</Label>
          <Textarea
            id="quiz-explanation"
            name="quiz-explanation"
            defaultValue={defaultValue?.explanation}
            placeholder="풀이를 입력해주세요"
            className="mt-2 mb-4"
          />
        </div>
        <ImageUploader
          labelText="퀴즈 이미지"
          defaultValue={defaultValue?.image}
          onFileSelect={setUploadedImage}
        />
      </div>

      <div className="flex justify-end items-center mt-4">
        <Button variant={"default"} type="submit" disabled={isSaving}>
          {isSaving ? (
            <Icon name="loading" className="animate-spin" />
          ) : defaultValue ? (
            "수정하기"
          ) : (
            "추가하기"
          )}
        </Button>
      </div>
    </form>
  );
}
