import { createClient } from "@/utils/supabase/client";
import { AppVersionForm, AdminVersionStatus, CommunityChannelForm } from "@/types/system";

export async function getAdminVersionStatus(): Promise<AdminVersionStatus | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("admin_version_status")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching admin version status:", error);
    return null;
  }

  return data;
}

export async function getAppVersions() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("app_versions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching app versions:", error);
    return null;
  }

  return data;
}

export async function createNewVersion(versionData: AppVersionForm) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc("activate_new_version", {
    new_latest_version: versionData.latest_version,
    new_minimum_version: versionData.minimum_version,
    new_release_notes: versionData.release_notes,
  });

  if (error) {
    console.error("Error creating new version:", error);
    throw error;
  }

  return data;
}

export async function getServiceStatus() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("service_status")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching service status:", error);
    return null;
  }

  return data;
}

export async function toggleMaintenanceMode(
  enableMaintenance: boolean,
  maintenanceMessage?: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc("toggle_maintenance_mode", {
    enable_maintenance: enableMaintenance,
    maintenance_msg: maintenanceMessage || null,
  });

  if (error) {
    console.error("Error toggling maintenance mode:", error);
    throw error;
  }

  return data;
}

export async function getVersionHistory() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("app_versions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching version history:", error);
    return [];
  }

  return data;
}

// 커뮤니티 채널 관리 함수들
export async function getCommunityChannels() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("community_channels")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching community channels:", error);
    return [];
  }

  return data;
}

export async function getAllCommunityChannels() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("community_channels")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching all community channels:", error);
    return [];
  }

  return data;
}

export async function createCommunityChannel(channelData: CommunityChannelForm) {
  const supabase = createClient();
  
  // 새 순서 인덱스 계산
  const { data: maxOrder } = await supabase
    .from("community_channels")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const nextOrderIndex = (maxOrder?.order_index || 0) + 1;

  const { data, error } = await supabase
    .from("community_channels")
    .insert({
      ...channelData,
      order_index: nextOrderIndex,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating community channel:", error);
    throw error;
  }

  return data;
}

export async function updateCommunityChannel(id: number, channelData: Partial<CommunityChannelForm>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("community_channels")
    .update({
      ...channelData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating community channel:", error);
    throw error;
  }

  return data;
}

export async function deleteCommunityChannel(id: number) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("community_channels")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting community channel:", error);
    throw error;
  }

  return true;
}

export async function toggleCommunityChannelActive(id: number, isActive: boolean) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("community_channels")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling community channel status:", error);
    throw error;
  }

  return data;
}

export async function updateCommunityChannelOrder(id: number, newOrder: number) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("community_channels")
    .update({
      order_index: newOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating community channel order:", error);
    throw error;
  }

  return data;
}

