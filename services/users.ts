import Profile from "@/types/user-profile";
import { createClient } from "@/utils/supabase/client";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";

export async function getUserProfiles(
  page: number = 1,
  limit: number = 10
): Promise<{
  data: Profile["Row"][];
}> {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const client = createClient();

  const { data, error } = await client
    .from("profiles")
    .select()
    .range(start, end)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return {
    data: data || [],
  };
}

export async function getUserCount(): Promise<number> {
  const { count, error } = await createClient()
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) throw error;

  return count || 0;
}
