"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { getStudies, updateStudyOrder } from "@/services/study";
import Study from "@/types/study";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/shadcn/card";
import Icon from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Badge } from "@/components/shadcn/badge";

export default function StudyOrderPage() {
  const [studyList, setStudyList] = useState<Study["Row"][]>([]);

  useEffect(() => {
    getStudies().then((res) => {
      setStudyList(res.data ?? []);
    });
  }, []);

  // [4] dnd-kit 센서
  const sensors = useSensors(useSensor(PointerSensor));

  // [5] 드래그 종료 시 순서 변경 처리
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 현재 배열 복제 후, movedItem을 newIndex 위치로 이동
    const items = [...studyList];
    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    const [movedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, movedItem);

    // newIndex 기준으로 "이전 아이템" / "다음 아이템" 조회
    const prevItem = items[newIndex - 1];
    const nextItem = items[newIndex + 1];

    let newOrder: number;
    if (!prevItem) {
      // 맨 앞에 놓인 경우 → 다음 아이템 order / 2
      newOrder = nextItem ? nextItem.order! / 2 : 1;
    } else if (!nextItem) {
      // 맨 뒤에 놓인 경우 → 이전 아이템 order + 1
      newOrder = prevItem.order! + 1;
    } else {
      // 사이에 끼워넣는 경우 → (prev + next) / 2
      newOrder = (prevItem.order! + nextItem.order!) / 2;
    }

    // 드래그된 아이템의 order 갱신
    movedItem.order = newOrder;

    // 최종 배열로 상태 업데이트
    updateStudyOrder(movedItem.id, newOrder);
    setStudyList(items);
  };

  const orderedStudyList = studyList.sort((a, b) => a.order! - b.order!);

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2>차트자료 순서 바꾸기</h2>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <Icon name="help" className="w-6 h-6 text-primary" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm whitespace-pre-line">
                  {
                    "차트자료를 드래그하여 원하는 순서로 이동시키세요.\n오름차순이며, 이동 즉시 저장됩니다."
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Link href={"/study"}>
          <Button variant="outline" className="text-base">
            목록으로
          </Button>
        </Link>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          // items => id 배열
          items={orderedStudyList.map((study) => study.id)}
          // Grid 형태를 위한 Strategy
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {orderedStudyList.map((study) => (
              <SortableStudyItem key={study.id} study={study} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableStudyItem({ study }: { study: Study["Row"] }) {
  // dnd-kit 훅
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: study.id });

  const style = {
    // 드래그 중 이동/투명도
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardContent className="px-4 py-2">
          <h3 className="text-base font-semibold line-clamp-1">
            {study.title}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {study.tags?.map((tag) => (
              <Badge variant="outline" className="text-xs">
                {tag?.name ?? ""}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
