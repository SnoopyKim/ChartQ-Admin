"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import ImageUploader from "@/components/ui/image-uploader";
import { QuizMC } from "@/types/quiz";
import { Label } from "@/components/shadcn/label";
import { useEffect, useState } from "react";
import Tag from "@/types/tag";
import { getTagList } from "@/services/tag";
import { Badge } from "@/components/shadcn/badge";
import { Switch } from "@/components/shadcn/switch";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import Icon from "@/components/ui/icon";
import { useDialog } from "@/hooks/use-dialog";
import { Textarea } from "@/components/shadcn/textarea";

export default function QuizMCForm({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: QuizMC;
  onSubmit: (data: {
    content: string;
    answer: number;
    choices: string[];
    tags: Partial<Tag>[];
    image?: File;
    explanation?: string;
  }) => Promise<void>;
}) {
  const { openDialog } = useDialog();
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Partial<Tag>[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [answer, setAnswer] = useState<number | undefined>(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  useEffect(() => {
    getTagList().then((res) => {
      if (res.error || !res.data) return;
      setTagList(res.data);
    });
  }, []);

  useEffect(() => {
    setSelectedTags(defaultValue?.tags ?? []);
    setChoices(defaultValue?.choices ?? [""]);
    setAnswer(defaultValue?.answer ?? 0);
  }, [defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get("quiz-content") as string;
    const explanation = formData.get("quiz-explanation") as string;

    if (choices.length === 0) {
      openDialog({
        title: "퀴즈 추가 불가",
        description: "선택지를 입력하세요",
      });
      return;
    }

    await onSubmit({
      content,
      choices,
      answer: answer ?? 0,
      tags: selectedTags,
      image: uploadedImage ?? undefined,
      explanation,
    });
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
          <div className="flex flex-col gap-2 mt-4">
            <Label>
              선택지{" "}
              <span className="ml-1 text-xs text-primary">
                색칠된 선택지가 정답입니다
              </span>
            </Label>
            <RadioGroup
              className="gap-2"
              value={answer?.toString()}
              onValueChange={(value) => {
                setAnswer(parseInt(value));
              }}
            >
              {choices.map((choice, index) => (
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    key={choice + index}
                    id={choice + index}
                    value={index.toString()}
                    className=""
                  />
                  <Input
                    type="text"
                    placeholder="선택지 내용을 입력해주세요"
                    className="ml-2"
                    value={choice}
                    onChange={(e) => {
                      setChoices((prev) =>
                        prev.map((c, i) => (i === index ? e.target.value : c))
                      );
                    }}
                  />
                  <Icon
                    name="trash"
                    className="w-9 h-9 text-red-500 hover:bg-red-500/10 rounded p-2"
                    onClick={() => {
                      setChoices((prev) => prev.filter((_, i) => i !== index));
                      if (index === answer) {
                        setAnswer(undefined);
                      } else if (!!answer && index < answer) {
                        setAnswer((prev) => prev! - 1);
                      }
                    }}
                  />
                </div>
              ))}
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setChoices((prev) => [...prev, ""]);
                }}
              >
                <Icon name="plus" />
              </Button>
            </RadioGroup>
          </div>
          <div className="mt-4">
            <Label htmlFor="quiz-explanation">풀이</Label>
            <Textarea
              id="quiz-explanation"
              name="quiz-explanation"
              defaultValue={defaultValue?.explanation}
              placeholder="풀이를 입력해주세요"
              className="mt-2"
            />
          </div>
        </div>
        <ImageUploader
          labelText="퀴즈 이미지"
          defaultValue={defaultValue?.image}
          onFileSelect={setUploadedImage}
        />
      </div>

      <div className="flex justify-end items-center mt-4">
        <Button variant={"default"} type="submit">
          {defaultValue ? "수정하기" : "추가하기"}
        </Button>
      </div>
    </form>
  );
}
