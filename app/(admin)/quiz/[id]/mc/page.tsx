"use client";

import QuizOXForm from "../../components/quiz-ox-form";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { QuizMC, QuizOX } from "@/types/quiz";
import Tag from "@/types/tag";
import { useRouter } from "next/navigation";
import { useDialog } from "@/hooks/use-dialog";
import Icon from "@/components/ui/icon";
import {
  deleteQuizOX,
  getQuizMC,
  getQuizOX,
  updateQuizMC,
  updateQuizOX,
} from "@/services/quiz";
import { addImageToStorage } from "@/services/study";
import QuizMCForm from "../../components/quiz-mc-form";
import { Button } from "@/components/shadcn/button";

export default function QuizMCEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { openDialog } = useDialog();
  const [quiz, setQuiz] = useState<QuizMC>();

  useEffect(() => {
    const fetchQuizMC = async () => {
      const { data, error } = await getQuizMC(params.id);
      if (error || !data) {
        toast({
          variant: "error",
          title: "퀴즈 불러오기 실패",
          description: error?.message || "알 수 없는 오류가 발생했습니다",
        });
        if (error?.code === "NOT_FOUND") {
          router.replace("/quiz");
        }
        return;
      }
      setQuiz(data);
    };
    fetchQuizMC();
  }, [params.id]);

  const handleUpdateQuizMC = async (data: {
    content: string;
    answer: number;
    choices: string[];
    tags: Partial<Tag>[];
    image?: File;
    explanation?: string;
  }) => {
    const newQuizMC: any = {
      id: params.id,
      content: data.content,
      answer: data.answer,
      choices: data.choices,
      tags: data.tags,
      explanation: data.explanation,
    };

    if (data.image) {
      const { data: imgUrl, error: imgError } = await addImageToStorage(
        "quiz",
        data.image,
        `${params.id}/image.png`
      );
      if (imgError || !imgUrl) {
        return;
      }
      newQuizMC.image = imgUrl;
    }
    const result = await updateQuizMC(newQuizMC);
    if (result) {
      toast({
        variant: "success",
        title: "성공적으로 수정되었습니다!",
      });
    }
  };

  const handleDeleteQuizMC = async () => {
    const isConfirmed = await openDialog({
      title: "퀴즈 삭제",
      description: "정말로 삭제하시겠습니까?",
    });
    if (!isConfirmed) return;

    const result = await deleteQuizOX(params.id);
    if (result) {
      toast({
        variant: "success",
        title: "삭제되었습니다.",
      });
      router.push("/quiz");
    } else {
      toast({
        variant: "error",
        title: "삭제에 실패했습니다.",
      });
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <h1 className="my-4">OX 퀴즈 편집</h1>
        <Icon
          name="trash"
          className="w-10 h-10 text-error cursor-pointer p-2 hover:bg-error/10 rounded-md"
          onClick={handleDeleteQuizMC}
        />
        <div className="flex-1"></div>
        <Button
          variant="outline"
          className="text-base"
          onClick={() => router.push("/quiz")}
        >
          목록으로
        </Button>
      </div>
      <div>
        <QuizMCForm defaultValue={quiz} onSubmit={handleUpdateQuizMC} />
      </div>
    </>
  );
}
