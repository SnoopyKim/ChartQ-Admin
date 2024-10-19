"use client";

import Study from "@/types/study";
import { useEffect, useState } from "react";
import StudyTable from "./study-table";
import { addStudy, getStudyList } from "@/services/study";
import Button from "@/components/ui/button";
import Link from "next/link";
import Icon from "@/components/ui/icon";

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

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <h1 className="mb-4">차트자료 관리</h1>
        <Link
          href={"/study/new"}
          className="flex gap-2 items-center pl-3 pr-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-900 hover:no-underline"
        >
          <Icon name="plus" className="w-5 h-5" />
          차트자료 추가
        </Link>
      </div>
      <StudyTable studyList={studyList} />
    </div>
  );
}
