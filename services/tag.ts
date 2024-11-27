import Tag from "@/types/tag";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getTagList(): Promise<{
  data?: Tag[];
  error?: any;
}> {
  const { data, error } = await supabase.from("tag").select("*");
  if (error) {
    return { error };
  }
  return { data: data as Tag[] };
}

export async function addTag(name: string): Promise<{
  data?: Tag;
  error?: any;
}> {
  const { data, error } = await supabase.from("tag").insert({ name }).select();
  if (error) {
    return { error };
  }
  return { data: data[0] as Tag };
}

export async function deleteTag(id: string): Promise<{
  error?: any;
}> {
  const { error } = await supabase.from("tag").delete().eq("id", id);
  return { error };
}
