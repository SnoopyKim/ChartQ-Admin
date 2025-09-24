"use client";

import { useState } from "react";
import { useSurveyQuestions } from "@/hooks/use-survey-questions";
import { SurveyQuestion } from "@/types/survey";
import QuestionList from "./components/question-list";
import QuestionForm from "./components/question-form";
import SurveyStatsDashboard from "./components/survey-stats-dashboard";
import { Button } from "@/components/shadcn/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { Plus, Eye, RefreshCw } from "lucide-react";

export default function SurveyPage() {
  const {
    questions,
    loading: isLoading,
    deleteQuestion: deleteQuestionFromHook,
    updateQuestion,
    reorderQuestions: reorderQuestionsFromHook,
    updateQuestionOptions,
    refreshQuestions,
  } = useSurveyQuestions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(
    null
  );

  const handleDeleteQuestion = async (id: string) => {
    if (
      !confirm(
        "이 질문을 삭제하시겠습니까? 관련된 모든 응답도 함께 삭제됩니다."
      )
    ) {
      return;
    }

    try {
      await deleteQuestionFromHook(id);
    } catch (error) {
      // Error handling is already done in the hook
    }
  };

  const handleEditQuestion = (question: SurveyQuestion) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refreshQuestions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설문조사 관리</h1>
          <p className="text-gray-600">
            온보딩 설문조사 질문과 선택지를 관리합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />새 질문 추가
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList>
          <TabsTrigger value="manage">질문 관리</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 설문조사 질문이 없습니다
              </h3>
              <p className="text-gray-600 mb-4">
                첫 번째 설문조사 질문을 추가해보세요
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />첫 질문 추가하기
              </Button>
            </div>
          ) : (
            <QuestionList
              questions={questions}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onToggleActive={async (question) => {
                await updateQuestion(question.id, {
                  is_active: !question.is_active,
                });
              }}
              onReorder={reorderQuestionsFromHook}
              onUpdateOptions={updateQuestionOptions}
            />
          )}
        </TabsContent>

        <TabsContent value="stats">
          <SurveyStatsDashboard onRefresh={refreshQuestions} />
        </TabsContent>
      </Tabs>

      <QuestionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingQuestion={editingQuestion}
      />
    </div>
  );
}
