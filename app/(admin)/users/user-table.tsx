"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Profile from "@/types/user-profile";
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
      <Input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm border"
        icon={"search"}
      />
      <div className="rounded-md border mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["id", "username", "email", "created_at", "updated_at"].map(
                (key) => (
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
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
