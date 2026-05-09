export interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'image' | 'video' | 'audio';
  content: string; // text content (caption for media messages, empty string if none)
  status: 'sending' | 'sent' | 'failed';
  timestamp: Date;
  document_url?: string; // downloadable solution document from AI
  mediaUrl?: string;
  mediaName?: string;
}
