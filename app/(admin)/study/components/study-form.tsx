"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import ImageUploader from "@/components/ui/image-uploader";
import Study from "@/types/study";
import { Label } from "@/components/shadcn/label";
import { useEffect, useState } from "react";
import Tag from "@/types/tag";
import { getTagList } from "@/services/tag";
import { Badge } from "@/components/shadcn/badge";

export default function StudyForm({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: Study["Update"];
  onSubmit: (data: {
    title: string;
    tags: Partial<Tag>[];
    image?: File;
  }) => Promise<void>;
}) {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Partial<Tag>[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  useEffect(() => {
    getTagList().then((res) => {
      if (res.error || !res.data) return;
      setTagList(res.data);
    });
  }, []);

  useEffect(() => {
    setSelectedTags(defaultValue?.tags ?? []);
  }, [defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;

    await onSubmit({
      title,
      tags: selectedTags,
      image: uploadedImage ?? undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValue?.title}
            placeholder="제목을 입력해주세요"
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
                    prev.includes(tag)
                      ? prev.filter((t) => t.id !== tag.id)
                      : [...prev, tag]
                  );
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <ImageUploader
          labelText="대표 이미지"
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
