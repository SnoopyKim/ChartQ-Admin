"use client";

import Button from "@/components/ui/button";
import ImageUploader from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import Study from "@/types/study";
import { useState } from "react";

export default function StudyForm({
  study,
  onSubmit,
}: {
  study?: Study["Update"];
  onSubmit: (data: {
    title: string;
    image: File | null;
    content: object;
  }) => Promise<void>;
}) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = { content: formData.get("content") as string };

    await onSubmit({ title, content, image: uploadedImage });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="title"
        defaultValue={study?.title}
        placeholder="제목을 입력해주세요"
        required
      />
      <div className="my-4">
        <ImageUploader
          labelText="대표 이미지"
          defaultValue={study?.image ?? undefined}
          onFileSelect={setUploadedImage}
        />
      </div>
      <p>내용</p>
      <textarea
        name="content"
        defaultValue={JSON.stringify(study?.content)}
        className="w-full h-96 border"
      />

      <div className="flex justify-between items-center mt-4">
        <Button
          variant={"outline"}
          type="button"
          onClick={() => window.history.back()}
        >
          취소
        </Button>
        <Button variant={"primary"} type="submit">
          {study ? "수정하기" : "추가하기"}
        </Button>
      </div>
    </form>
  );
}
