import { createClient } from "@/utils/supabase/client";
import { AppVersionForm, MaintenanceToggle, AdminVersionStatus } from "@/types/system";

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