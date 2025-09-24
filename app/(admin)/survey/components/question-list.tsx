"use client";

import { useState } from "react";
import { SurveyQuestion, SurveyOption } from "@/types/survey";
import OptionManager from "./option-manager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Switch } from "@/components/shadcn/switch";
import { Edit, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils/cn";

interface QuestionListProps {
  questions: SurveyQuestion[];
  onEdit: (question: SurveyQuestion) => void;
  onDelete: (id: string) => void;
  onToggleActive: (question: SurveyQuestion) => Promise<void>;
  onReorder: (newOrder: { id: string; question_order: number }[]) => Promise<void>;
  onUpdateOptions: (questionId: string, newOptions: SurveyOption[]) => void;
}

interface SortableQuestionItemProps {
  question: SurveyQuestion;
  index: number;
  expandedQuestions: Set<string>;
  onToggleExpanded: (questionId: string) => void;
  onEdit: (question: SurveyQuestion) => void;
  onDelete: (id: string) => void;
  onToggleActive: (question: SurveyQuestion) => void;
  onUpdateOptions: (questionId: string, newOptions: SurveyOption[]) => void;
}

function SortableQuestionItem({
  question,
  expandedQuestions,
  onToggleExpanded,
  onEdit,
  onDelete,
  onToggleActive,
  onUpdateOptions,
}: Omit<SortableQuestionItemProps, "index">) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`transition-opacity ${
        !question.is_active ? "opacity-60" : ""
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex flex-col items-center gap-1 pt-1">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
                title="드래그하여 순서 변경"
              >
                <GripVertical className="h-5 w-5 text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-500">
                {question.question_order}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg whitespace-pre-line">
                {question.question_text}
              </CardTitle>
              {question.question_description && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                  {question.question_description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {question.options?.length || 0}개 선택지
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={question.is_active}
              onCheckedChange={() => onToggleActive(question)}
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(question)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(question.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleExpanded(question.id)}
          className={cn("mb-0", expandedQuestions.has(question.id) && "mb-4")}
        >
          {expandedQuestions.has(question.id) ? "선택지 숨기기" : "선택지 관리"}
        </Button>
        {expandedQuestions.has(question.id) && (
          <OptionManager
            questionId={question.id}
            options={question.options || []}
            onOptionsChange={(newOptions) => {
              // Update only this question's options without triggering full refetch
              onUpdateOptions(question.id, newOptions);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function QuestionList({
  questions,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
  onUpdateOptions,
}: QuestionListProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleToggleActive = async (question: SurveyQuestion) => {
    await onToggleActive(question);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Create new array with reordered questions
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(oldIndex, 1);
    newQuestions.splice(newIndex, 0, movedQuestion);

    // Update question orders
    const reorderedQuestions = newQuestions.map((q, idx) => ({
      id: q.id,
      question_order: idx + 1,
    }));

    await onReorder(reorderedQuestions);
  };

  const activeQuestion = activeId
    ? questions.find((q) => q.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {questions.map((question) => (
            <SortableQuestionItem
              key={question.id}
              question={question}
              expandedQuestions={expandedQuestions}
              onToggleExpanded={toggleExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={handleToggleActive}
              onUpdateOptions={onUpdateOptions}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeQuestion ? (
          <Card className="opacity-75 shadow-2xl rotate-3 ">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    {activeQuestion.question_order}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg whitespace-pre-line">
                    {activeQuestion.question_text}
                  </CardTitle>
                  {activeQuestion.question_description && (
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                      {activeQuestion.question_description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {activeQuestion.options?.length || 0}개 선택지
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
