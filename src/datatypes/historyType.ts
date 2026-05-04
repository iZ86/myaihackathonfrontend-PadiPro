export type HistoryItem = {
  id: string;
  from: string;
  mediaId: string;
  mimeType: string;
  storage_path: string;
  download_url: string;
  created_at: string;
  sha256: string;
  detections: [
    {
      disease: string;
      severity: number;
      score: number;
    }
  ];
  diagnosis?: string;
  severity?: string;
  title?: string;
  status?: string;
  statusColor?: string;
  statusBg?: string;
  statusText?: string;
}

