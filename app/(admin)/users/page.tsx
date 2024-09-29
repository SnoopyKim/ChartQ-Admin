"use client";

import { getUserProfiles } from "@/services/users";
import Profile from "@/types/user-profile";
import { useEffect, useState } from "react";
import UserTable from "./user-table";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile["Row"][]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUserProfiles();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1 className="mb-4">User Management</h1>
      <UserTable users={users} />
    </div>
  );
}
