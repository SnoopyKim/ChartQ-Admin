export interface AppVersion {
  id: number;
  latest_version: string;
  minimum_version: string;
  release_notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceStatus {
  id: number;
  is_maintenance_mode: boolean;
  maintenance_message: string | null;
  maintenance_start_time: string | null;
  maintenance_end_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppVersionForm {
  latest_version: string;
  minimum_version: string;
  release_notes: string;
}

export interface MaintenanceToggle {
  is_maintenance_mode: boolean;
  maintenance_message?: string;
  maintenance_start_time?: string;
  maintenance_end_time?: string;
}

export interface SystemStatus {
  app_version: AppVersion;
  service_status: ServiceStatus;
}

export interface AdminVersionStatus {
  latest_version: string;
  minimum_version: string;
  version_active: boolean;
  version_updated: string;
  is_maintenance_mode: boolean;
  maintenance_message: string | null;
  service_updated: string;
}
