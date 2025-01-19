"use client";

import { addStudy } from "@/services/study";
import StudyForm from "../components/quiz-ox-form";
import Study from "@/types/study";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "next/navigation";
import Tag from "@/types/tag";
import Link from "next/link";
import QuizOXForm from "../components/quiz-ox-form";
import { addQuizMC, addQuizOX } from "@/services/quiz";
import QuizMCForm from "../components/quiz-mc-form";

export default function NewQuizPage({
  searchParams,
}: {
  searchParams: { type: string };
}) {
  const router = useRouter();

  const handleAddQuizOX = async (data: {
    content: string;
    answer: boolean;
    tags: Partial<Tag>[];
    image?: File;
    explanation?: string;
  }) => {
    const { data: result, error } = await addQuizOX(data);
    if (error || !result) {
      toast({
        variant: "error",
        title: "퀴즈 추가에 실패했습니다.",
      });
      return;
    }

    router.push(`/quiz/${result.id}/ox`);
    toast({
      variant: "success",
      title: "성공적으로 추가되었습니다!",
    });
  };

  const handleAddQuizMC = async (data: {
    content: string;
    choices: string[];
    answer: number;
    tags: Partial<Tag>[];
    image?: File;
    explanation?: string;
  }) => {
    const { data: result, error } = await addQuizMC(data);
    if (error || !result) {
      toast({
        variant: "error",
        title: "퀴즈 추가에 실패했습니다.",
      });
      return;
    }

    router.push(`/quiz/${result.id}/mc`);
    toast({
      variant: "success",
      title: "성공적으로 추가되었습니다!",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-4">
          {searchParams.type === "mc" ? "객관식" : "OX"} 퀴즈 추가
        </h1>
        <Link href="/quiz">
          <Button variant="outline" className="text-base">
            목록으로
          </Button>
        </Link>
      </div>
      {searchParams.type === "mc" ? (
        <QuizMCForm onSubmit={handleAddQuizMC} />
      ) : (
        <QuizOXForm onSubmit={handleAddQuizOX} />
      )}
    </div>
  );
}
