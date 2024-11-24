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
    const result = await addStudy(data);
    if (result) {
      toast({
        title: "성공적으로 추가되었습니다!",
      });
    }
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
