"use client";

import Study from "@/types/study";
import { useEffect, useState } from "react";
import {
  getStudies,
  getStudiesByTag,
  getStudiesWithNoTags,
} from "@/services/study";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { StudyCard } from "./components/study-card";
import Tag from "@/types/tag";
import { getTagList } from "@/services/tag";
import { Badge } from "@/components/shadcn/badge";
import Icon from "@/components/ui/icon";

export default function StudyListPage() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [studyList, setStudyList] = useState<Study["Row"][]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [premiumFilter, setPremiumFilter] = useState<
    "all" | "premium" | "free"
  >("all");

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
    if (selectedTag === "all") {
      getStudies().then((res) => {
        setStudyList(res.data ?? []);
      });
    } else if (selectedTag === "none") {
      getStudiesWithNoTags().then((res) => {
        setStudyList(res.data ?? []);
      });
    } else {
      getStudiesByTag(selectedTag).then((res) => {
        setStudyList(res.data ?? []);
      });
    }
  }, [selectedTag]);

  const filteredStudyList = studyList.filter((study) => {
    const matchesSearch = study.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPremium =
      premiumFilter === "all" ||
      (premiumFilter === "premium" && study.is_premium) ||
      (premiumFilter === "free" && !study.is_premium);

    return matchesSearch && matchesPremium;
  });

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <h2>차트자료 관리</h2>
        <div className="flex gap-2 items-center">
          <Link
            href={"/study/order"}
            className="flex gap-2 items-center pl-3 pr-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-900 hover:no-underline text-sm"
          >
            <Icon name="order" className="w-4 h-4" />
            순서 바꾸기
          </Link>
          <Link
            href={"/study/new"}
            className="flex gap-2 items-center pl-3 pr-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-900 hover:no-underline text-sm"
          >
            <Icon name="plus" className="w-4 h-4" />
            차트자료 추가
          </Link>
        </div>
      </div>
      {/* 프리미엄 필터 섹션 */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 my-2">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="puzzle" className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700">
            프리미엄 필터
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={premiumFilter === "all" ? "default" : "outline"}
            onClick={() => setPremiumFilter("all")}
            className="cursor-pointer"
          >
            전체
          </Badge>
          <Badge
            variant={premiumFilter === "premium" ? "default" : "outline"}
            onClick={() => setPremiumFilter("premium")}
            className="cursor-pointer"
          >
            프리미엄만
          </Badge>
          <Badge
            variant={premiumFilter === "free" ? "default" : "outline"}
            onClick={() => setPremiumFilter("free")}
            className="cursor-pointer"
          >
            무료만
          </Badge>
        </div>
      </div>
      {/* 태그 필터 섹션 */}
      <div className="bg-gray-50 p-4 rounded-lg border my-2">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="tag" className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">태그별 필터</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={selectedTag === "all" ? "default" : "outline"}
            onClick={() => setSelectedTag("all")}
            className="cursor-pointer"
          >
            전체
          </Badge>
          <Badge
            variant={selectedTag === "none" ? "default" : "outline"}
            onClick={() => setSelectedTag("none")}
            className="cursor-pointer"
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
              className="cursor-pointer"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="container">
        <SearchBar
          onSearch={(value) => {
            setSearchTerm(value);
          }}
          placeholder="제목 검색"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {filteredStudyList.map((study) => (
          <Link href={`/study/${study.id}`} key={study.id}>
            <StudyCard study={study} />
          </Link>
        ))}
      </div>
    </div>
  );
}
