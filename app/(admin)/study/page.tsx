"use client";

import Study from "@/types/study";
import { useEffect, useState } from "react";
import { addStudy, getStudyList } from "@/services/study";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Input } from "@/components/shadcn/input";
import { SearchBar } from "@/components/SearchBar";
import { StudyCard } from "./components/study-card";

export default function StudyListPage() {
  const [studyList, setStudyList] = useState<Study["Row"][]>([]);
  const [selectedCategory, setSelectedCategory] = useState("tech");

  useEffect(() => {
    const fetchStudyList = async () => {
      const { data, error } = await getStudyList(selectedCategory);
      if (error || !data) return;
      setStudyList(data);
    };
    fetchStudyList();
  }, [selectedCategory]);

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <h2>차트자료 관리</h2>
          <Tabs defaultValue="tech" onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="tech">기술</TabsTrigger>
              <TabsTrigger value="life">일상</TabsTrigger>
              <TabsTrigger value="travel">여행</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Link
          href={"/study/new"}
          className="flex gap-2 items-center pl-3 pr-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-900 hover:no-underline text-sm"
        >
          <Icon name="plus" className="w-4 h-4" />
          차트자료 추가
        </Link>
      </div>
      <div className="container mt-4">
        <SearchBar
          onSearch={(res) => {
            console.log(res);
          }}
          placeholder="검색어를 입력하세요..."
          table="study"
          searchColumn="title"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {studyList.map((study) => (
          <Link href={`/study/${study.id}`} key={study.id}>
            <StudyCard
              title={study.title}
              image={study.image}
              updatedAt={study.updated_at}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
