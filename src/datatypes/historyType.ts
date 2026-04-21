export type HistoryItem = {
  id: string;
  from: string;
  mediaId: string;
  mimeType: string;
  storage_path: string;
  download_url: string;
  created_at: string;
  sha256: string;
  // Dummy fields
  title?: string;
  status?: string;
  statusColor?: string;
  statusBg?: string;
  statusText?: string;
}

