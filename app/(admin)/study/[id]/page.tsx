"use client";

import {
  addImageToStorage,
  getStudy,
  updateStudy,
  updateStudyContent,
} from "@/services/study";
import StudyForm from "../components/study-form";
import Editor from "@/components/editor";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Study from "@/types/study";
import { Button } from "@/components/shadcn/button";

export default function StudyEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step: string };
}) {
  const [study, setStudy] = useState<Study["Row"]>();
  const [content, setContent] = useState<string>(""); // 상태 타입을 명시적으로 설정
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStudy = async () => {
      const { data, error } = await getStudy(params.id);
      if (error || !data) {
        toast({
          title: "차트자료를 불러오는데 실패했습니다.",
        });
        return;
      }
      setStudy(data);
      setContent(data.content ?? "");
    };
    fetchStudy();
  }, [params.id]);

  const handleUpdateStudy = async (data: {
    title: string;
    category: string;
    image?: File;
  }) => {
    const result = await updateStudy({ id: params.id, ...data });
    if (result) {
      toast({
        title: "성공적으로 수정되었습니다!",
      });
    }
  };

  // 저장할 때 호출되는 함수
  const handleSaveContent = async () => {
    setIsSaving(true);
    let htmlContent = content; // 현재 HTML 내용

    // Base64 이미지 찾기
    const base64Images = htmlContent.match(
      /<img[^>]+src="data:image\/[^">]+">/g
    );

    if (base64Images) {
      // 모든 Base64 이미지를 업로드하고 URL로 변환
      for (let i = 0; i < base64Images.length; i++) {
        const imgTag = base64Images[i];
        const base64Data = imgTag.match(/src="([^"]+)"/)![1];
        const file = base64ToFile(base64Data); // Base64를 파일로 변환

        const { data: imageUrl, error } = await addImageToStorage(
          "study",
          file,
          `${study!.id}/content-${i}.png`
        );
        if (error || !imageUrl) {
          return;
        }
        // HTML 내용에서 Base64 이미지를 업로드된 URL로 교체
        htmlContent = htmlContent.replace(base64Data, imageUrl);
      }
    }

    // 이미지 URL로 교체된 HTML 저장
    const result = await updateStudyContent(study!.id, htmlContent);
    setIsSaving(false);

    if (!result) {
      toast({
        variant: "error",
        title: "저장에 실패했습니다.",
      });
    } else {
      setStudy((prev) =>
        prev ? { ...prev, content: htmlContent } : undefined
      );
      toast({
        variant: "success",
        title: "저장되었습니다.",
      });
    }
  };

  // Base64 문자열을 File 객체로 변환하는 함수
  const base64ToFile = (base64: string, filename = "image.png") => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <>
      <div className="flex justify-between">
        <Link
          href={
            searchParams.step !== "content" ? "/study" : `/study/${params.id}`
          }
          replace
          className="flex gap-2 items-center"
        >
          <Icon name="arrow-left" className="w-5 h-5" /> 뒤로
        </Link>
        {searchParams.step === "content" ? (
          <Button
            onClick={handleSaveContent}
            disabled={isSaving}
            className="text-base"
          >
            저장
          </Button>
        ) : (
          <Link
            href={`/study/${params.id}/?step=content`}
            className="flex gap-2 items-center"
          >
            내용 편집 <Icon name="arrow-left" className="rotate-180 w-5 h-5" />
          </Link>
        )}
      </div>
      <h1 className="my-4">차트자료 편집</h1>
      <div>
        {searchParams.step === "content" ? (
          <Editor content={content || ""} onChange={setContent} />
        ) : (
          <StudyForm defaultValue={study} onSubmit={handleUpdateStudy} />
        )}
      </div>
    </>
  );
}
