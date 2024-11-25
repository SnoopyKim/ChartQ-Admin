"use client";

import { addStudy } from "@/services/study";
import StudyForm from "../components/study-form";
import Study from "@/types/study";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "next/navigation";

export default function NewStudyPage() {
  const router = useRouter();

  const handleAddStudy = async (data: {
    title: string;
    category: string;
    image?: File;
  }) => {
    const { data: result, error } = await addStudy(data);
    if (error || !result) {
      toast({
        variant: "error",
        title: "차트자료 추가에 실패했습니다.",
      });
      return;
    }

    router.push(`/study/${result.id}`);
    toast({
      variant: "success",
      title: "성공적으로 추가되었습니다!",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-4">차트자료 추가</h1>
        <Button
          variant="outline"
          className="text-base"
          onClick={() => router.push("/study")}
        >
          목록으로
        </Button>
      </div>
      <StudyForm onSubmit={handleAddStudy} />
    </div>
  );
}
