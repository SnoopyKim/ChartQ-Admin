"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/shadcn/badge";
import Icon from "@/components/ui/icon";
import { getStudyViewCounts } from "@/services/study-analytics";
import { StudyViewCount as StudyViewCountType } from "@/types/study-analytics";

interface StudyViewCountProps {
  studyId: string;
  compact?: boolean;
  className?: string;
}

export function StudyViewCount({
  studyId,
  compact = false,
  className = "",
}: StudyViewCountProps) {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        setLoading(true);
        const result = await getStudyViewCounts();

        if (result.data) {
          const studyViewData = result.data.find(
            (item) => item.study_id === studyId
          );
          setViewCount(studyViewData?.view_count || 0);
        }
      } catch (error) {
        console.error("Error fetching view count:", error);
        setViewCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (studyId) {
      fetchViewCount();
    }
  }, [studyId]);

  if (loading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {!compact && (
          <span className="text-xs text-gray-400">조회수 로딩중...</span>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <Badge variant="outline" className={`text-xs ${className}`}>
        <Icon name="eye" className="w-3 h-3 mr-1" />
        {viewCount.toLocaleString()}
      </Badge>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-sm text-gray-600 ${className}`}
    >
      <Icon name="eye" className="w-4 h-4" />
      <span>조회수: {viewCount.toLocaleString()}</span>
    </div>
  );
}
