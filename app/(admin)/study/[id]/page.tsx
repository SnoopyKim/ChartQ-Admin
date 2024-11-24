"use client";

import { getStudy, updateStudy } from "@/services/study";
import StudyForm from "../components/study-form";
import Editor from "@/components/editor";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Study from "@/types/study";

export default function StudyEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step: string };
}) {
  const [study, setStudy] = useState<Study["Row"]>();
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
        {searchParams.step !== "content" && (
          <Link
            href={`/study/${params.id}/?step=content`}
            className="flex gap-2 items-center"
          >
            내용 편집 <Icon name="arrow-left" className="rotate-180 w-5 h-5" />
          </Link>
        )}
      </div>
      <h1 className="my-4">차트자료 편집</h1>
      <div className="flex-1">
        {searchParams.step === "content" ? (
          <Editor studyId={params.id} defaultValue={study?.content ?? ""} />
        ) : (
          <StudyForm defaultValue={study} onSubmit={handleUpdateStudy} />
        )}
      </div>
    </>
  );
}
