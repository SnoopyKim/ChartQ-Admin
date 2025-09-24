import { useState, useEffect, useCallback } from "react";
import { SurveyQuestion, QuestionForm, SurveyOption } from "@/types/survey";
import { 
  getQuestions, 
  updateQuestion as updateQuestionAPI, 
  deleteQuestion as deleteQuestionAPI,
  reorderQuestions as reorderQuestionsAPI 
} from "@/services/survey";
import { useToast } from "@/hooks/use-toast";

interface UseSurveyQuestionsReturn {
  questions: SurveyQuestion[];
  loading: boolean;
  error: string | null;
  updateQuestion: (id: string, data: Partial<QuestionForm>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  reorderQuestions: (newOrder: { id: string; question_order: number }[]) => Promise<void>;
  updateQuestionOptions: (questionId: string, newOptions: SurveyOption[]) => void;
  refreshQuestions: () => Promise<void>;
  clearError: () => void;
}

export function useSurveyQuestions(): UseSurveyQuestionsReturn {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getQuestions();
      
      if (fetchError) {
        throw new Error("질문 목록을 불러오는 중 오류가 발생했습니다.");
      }
      
      setQuestions(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateQuestion = useCallback(async (id: string, data: Partial<QuestionForm>) => {
    // Optimistic update
    setQuestions(prevQuestions => {
      return prevQuestions.map(q => 
        q.id === id ? { ...q, ...data, updated_at: new Date().toISOString() } : q
      );
    });

    try {
      const { error: updateError } = await updateQuestionAPI(id, data);
      
      if (updateError) {
        throw new Error("질문 업데이트 중 오류가 발생했습니다.");
      }

      toast({
        title: "업데이트 완료",
        description: "질문이 성공적으로 업데이트되었습니다.",
      });
    } catch (err) {
      // Rollback on error by refetching
      await fetchQuestions();
      const errorMessage = err instanceof Error ? err.message : "업데이트 실패";
      setError(errorMessage);
      toast({
        title: "업데이트 실패",
        description: errorMessage,
        variant: "error",
      });
      throw err;
    }
  }, [toast, fetchQuestions]);

  const deleteQuestion = useCallback(async (id: string) => {
    // Optimistic update
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));

    try {
      const { success, error: deleteError } = await deleteQuestionAPI(id);
      
      if (deleteError || !success) {
        throw new Error("질문 삭제 중 오류가 발생했습니다.");
      }

      toast({
        title: "삭제 완료",
        description: "질문이 성공적으로 삭제되었습니다.",
      });
    } catch (err) {
      // Rollback on error by refetching
      await fetchQuestions();
      const errorMessage = err instanceof Error ? err.message : "삭제 실패";
      setError(errorMessage);
      toast({
        title: "삭제 실패",
        description: errorMessage,
        variant: "error",
      });
      throw err;
    }
  }, [toast, fetchQuestions]);

  const reorderQuestions = useCallback(async (newOrder: { id: string; question_order: number }[]) => {
    // Optimistic update
    setQuestions(prevQuestions => {
      const sorted = [...prevQuestions].sort((a, b) => {
        const aOrder = newOrder.find(o => o.id === a.id)?.question_order || a.question_order;
        const bOrder = newOrder.find(o => o.id === b.id)?.question_order || b.question_order;
        return aOrder - bOrder;
      });
      return sorted.map(q => {
        const newOrderItem = newOrder.find(o => o.id === q.id);
        return newOrderItem ? { ...q, question_order: newOrderItem.question_order } : q;
      });
    });

    try {
      const { success, error: reorderError } = await reorderQuestionsAPI(newOrder);
      
      if (reorderError || !success) {
        throw new Error("질문 순서 변경 중 오류가 발생했습니다.");
      }

      toast({
        title: "순서 변경 완료",
        description: "질문 순서가 성공적으로 변경되었습니다.",
      });
    } catch (err) {
      // Rollback on error by refetching
      await fetchQuestions();
      const errorMessage = err instanceof Error ? err.message : "순서 변경 실패";
      setError(errorMessage);
      toast({
        title: "순서 변경 실패",
        description: errorMessage,
        variant: "error",
      });
      throw err;
    }
  }, [toast, fetchQuestions]);

  const refreshQuestions = useCallback(async () => {
    await fetchQuestions();
  }, [fetchQuestions]);

  const updateQuestionOptions = useCallback((questionId: string, newOptions: SurveyOption[]) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === questionId ? { ...q, options: newOptions } : q
      )
    );
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    loading,
    error,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    updateQuestionOptions,
    refreshQuestions,
    clearError,
  };
}