"use client";

import Study from "@/types/study";
import { useEffect, useState } from "react";
import { getStudiesByTag, getStudiesWithNoTags } from "@/services/study";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { StudyCard } from "./components/study-card";
import Tag from "@/types/tag";
import { getTagList } from "@/services/tag";
import { Badge } from "@/components/shadcn/badge";
import Icon from "@/components/ui/icon";

export default function StudyListPage() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [studyList, setStudyList] = useState<Study["Row"][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      getTagList().then((res) => {
        if (res.error) return;
        setTagList(res.data!);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      getStudiesByTag(selectedTag).then((res) => {
        setStudyList(res.data!);
      });
    } else {
      getStudiesWithNoTags().then((res) => {
        setStudyList(res.data!);
      });
    }
  }, [selectedTag]);

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <h2>차트자료 관리</h2>
        <Link
          href={"/study/new"}
          className="flex gap-2 items-center pl-3 pr-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-900 hover:no-underline text-sm"
        >
          <Icon name="plus" className="w-4 h-4" />
          차트자료 추가
        </Link>
      </div>
      <div className="flex gap-2 flex-wrap my-2">
        <Badge
          variant={selectedTag === "" ? "default" : "outline"}
          onClick={() => setSelectedTag("")}
        >
          태그 없음
        </Badge>
        {tagList.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTag === tag.id ? "default" : "outline"}
            onClick={() =>
              setSelectedTag((prev) => (prev === tag.id ? "" : tag.id))
            }
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      <div className="container">
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
