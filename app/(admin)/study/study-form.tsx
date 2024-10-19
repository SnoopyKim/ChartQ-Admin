"use client";

import Button from "@/components/ui/button";
import EditorContainer from "@/components/ui/editor/container";
import ImageUploader from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { addStudy } from "@/services/study";
import Study from "@/types/study";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudyForm({ study }: { study?: Study["Update"] }) {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = { content: formData.get("content") as string };

    if (study) {
      // TODO: update study
    } else {
      const id = await addStudy({ title, content });
      alert("성공적으로 추가되었습니다!\n내용 작성 화면으로 이동합니다");
      router.replace(`/study/${id}/?step=content`);
    }
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
