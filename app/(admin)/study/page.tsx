"use client";

import Study from "@/types/study";
import { useEffect, useState } from "react";
import StudyTable from "./study-table";
import { addStudy, getStudyList } from "@/services/study";
import Button from "@/components/ui/button";

export default function StudyListPage() {
  const [studyList, setStudyList] = useState<Study["Row"][]>([]);
  useEffect(() => {
    const fetchStudyList = async () => {
      const data = await getStudyList();
      console.log(data);
      setStudyList(data);
    };
    fetchStudyList();
  }, []);

  const handleAddStudy = async () => {
    const result = await addStudy({
      title: "test",
      content: { test: "test" },
    });
    console.log("Add study result: ", result);
  };

  return (
    <div className="container">
      <div className="flex justify-between">
        <h1 className="mb-4">차트자료 관리</h1>
        <Button onClick={handleAddStudy}>차트자료 추가</Button>
      </div>
      <StudyTable studyList={studyList} />
    </div>
  );
}
