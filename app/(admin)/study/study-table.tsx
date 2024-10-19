"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Study from "@/types/study";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

export default function StudyTable({
  studyList,
}: {
  studyList: Study["Row"][];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Study["Row"]>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof Study["Row"]) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedAndFilteredStudys = studyList
    .filter((study) =>
      Object.values(study).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const _a = a?.[sortKey] ?? "";
      const _b = b?.[sortKey] ?? "";

      if (_a < _b) return sortOrder === "asc" ? -1 : 1;
      if (_a > _b) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <>
      <Input
        type="text"
        placeholder="Search studies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
        icon={"search"}
      />
      <div className="rounded-md border mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["id", "title", "updated_at", ""].map((key) => (
                <TableHead key={key}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(key as keyof Study["Row"])}
                    className="font-bold"
                  >
                    {key.toUpperCase()}
                    {sortKey === key &&
                      (sortOrder === "asc" ? (
                        <Icon name="chevron-up" className="ml-2 h-4 w-4" />
                      ) : (
                        <Icon name="chevron-down" className="ml-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredStudys.map((study) => (
              <TableRow key={study.id}>
                <TableCell>{study.id}</TableCell>
                <TableCell>{study.title || "-"}</TableCell>

                <TableCell>{study.updated_at}</TableCell>
                <TableCell className="w-0">
                  <DropdownMenu>
                    <Icon name="file-pen" className="h-4 w-4" />
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
