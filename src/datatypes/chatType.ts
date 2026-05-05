export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  timestamp: Date;
}
