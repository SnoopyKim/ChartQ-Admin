import { createClient } from "@/utils/supabase/client";

export async function getActiveCommunityChannels() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("community_channels")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching active community channels:", error);
    return [];
  }

  return data;
}