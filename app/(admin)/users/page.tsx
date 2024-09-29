"use client";

import { getUserProfiles } from "@/services/users";
import Profile from "@/types/user-profile";
import { useEffect, useState } from "react";

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
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.id}</p>
          <p>{user.email}</p>
          <p>{user.username}</p>
          <p>{user.updated_at}</p>
          <p>{user.created_at}</p>
        </div>
      ))}
    </div>
  );
}
