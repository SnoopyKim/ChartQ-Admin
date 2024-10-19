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

export async function addStudy(newStudy: Study["Insert"]): Promise<string> {
  const { data, error } = await createClient()
    .from("study")
    .insert(newStudy)
    .select("id");
  if (error) throw error;

  const id = data[0]?.id;
  console.log("Added study : ", id);
  return id;
}

export async function updateStudy(
  id: string,
  newStudy: Study["Update"]
): Promise<boolean> {
  const { error } = await createClient()
    .from("study")
    .update(newStudy)
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function deleteStudy(id: string): Promise<boolean> {
  const { error } = await createClient().from("study").delete().eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}
