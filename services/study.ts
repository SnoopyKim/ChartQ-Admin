import Study from "@/types/study";
import { createClient } from "@/utils/supabase/client";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";

export async function getStudyList(): Promise<Study["Row"][]> {
  const { data, error } = await createClient().from("study").select();

  if (error) throw error;

  return data;
}

export async function getStudy(id: string): Promise<Study["Row"]> {
  const { data, error } = await createClient()
    .from("study")
    .select()
    .eq("id", id);

  if (error) throw error;

  return data[0];
}

export async function addStudy(
  newStudy: Study["Insert"]
): Promise<Study["Row"]> {
  const { data, error } = await createClient().from("study").insert(newStudy);

  if (error) throw error;

  return (data ?? [])[0];
}
