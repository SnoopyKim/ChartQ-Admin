"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { QuizCard } from "./components/quiz-card";
import Icon from "@/components/ui/icon";
import { Quiz } from "@/types/quiz";
import { getQuizChoiceList, getQuizOXList } from "@/services/quiz";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DialogTitle } from "@/components/shadcn/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

export default function StudyListPage() {
  const [selectedType, setSelectedType] = useState("ox");
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [fetching, setFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFetching(true);
    if (selectedType === "ox") {
      getQuizOXList().then((res) => {
        setQuizList(res.data!);
        setFetching(false);
      });
    } else {
      getQuizChoiceList().then((res) => {
        setQuizList(res.data!);
        setFetching(false);
      });
    }
  }, [selectedType]);

  const sortedAndFilteredQuizList = quizList
    .filter((quiz) =>
      quiz.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <h2>퀴즈 관리</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center pl-3 pr-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-900 hover:no-underline text-sm">
            <Icon name="plus" className="w-4 h-4" />
            퀴즈 추가
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>퀴즈 종류 선택</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/quiz/new?type=ox">OX</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/quiz/new?type=choice">객관식</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2 flex-wrap my-2">
        <Tabs
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <TabsList>
            <TabsTrigger value="ox">OX</TabsTrigger>
            <TabsTrigger value="choice">객관식</TabsTrigger>
          </TabsList>
        </Tabs>
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
        {fetching ? (
          <Icon
            name="loading"
            className="w-10 h-10 animate-spin text-slate-600 "
          />
        ) : (
          sortedAndFilteredQuizList.map((quiz) => (
            <Link href={`/quiz/${quiz.id}/${selectedType}`} key={quiz.id}>
              <QuizCard
                title={quiz.content}
                image={quiz.image}
                tags={quiz.tags}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
