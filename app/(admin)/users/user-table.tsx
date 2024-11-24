"use client";

import { useState } from "react";
import Profile from "@/types/user-profile";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/shadcn/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shadcn/table";
import { SearchBar } from "@/components/SearchBar";

export default function UserTable({ users }: { users: Profile["Row"][] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Profile["Row"]>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof Profile["Row"]) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedAndFilteredUsers = users
    .filter((user) =>
      Object.values(user).some((value) =>
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
      <SearchBar
        onSearch={(res) => {
          console.log(res);
        }}
        placeholder="검색어를 입력하세요..."
        table="profiles"
        searchColumn="email"
      />
      <div className="relative w-full rounded-md border mt-4 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["username", "email", "type", "updated_at"].map((key) => (
                <TableHead key={key}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(key as keyof Profile["Row"])}
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
            {sortedAndFilteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  {new Date(user.updated_at!).toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
