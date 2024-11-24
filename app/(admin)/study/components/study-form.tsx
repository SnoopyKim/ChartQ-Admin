"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import ImageUploader from "@/components/ui/image-uploader";
import { addStudy, updateStudy } from "@/services/study";
import Study from "@/types/study";
import { Label } from "@/components/shadcn/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudyForm({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: Study["Update"];
  onSubmit: (data: {
    title: string;
    category: string;
    image?: File;
  }) => Promise<void>;
}) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;

    await onSubmit({
      title,
      category,
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
          <Label htmlFor="category">카테고리</Label>
          <Input
            id="category"
            name="category"
            defaultValue={defaultValue?.category}
            placeholder="카테고리를 입력해주세요"
            className="mt-2"
            required
          />
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
