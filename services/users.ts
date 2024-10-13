import Profile from "@/types/user-profile";
import { createClient } from "@/utils/supabase/client";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";

export async function getUserProfiles(): Promise<Profile["Row"][]> {
  const { data, error } = await createClient().from("profiles").select();

  if (error) throw error;

  return data;
}
