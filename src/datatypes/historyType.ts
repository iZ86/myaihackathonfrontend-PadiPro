export type HistoryItem = {
  id: string;
  from: string;
  mediaId: string;
  mimeType: string;
  storage_path: string;
  download_url: string;
  created_at: string;
  sha256: string;
  severity: number;
  diagnosis: string;
  title?: string;
  status?: string;
  statusColor?: string;
  statusBg?: string;
  statusText?: string;
}

