export interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'image' | 'video' | 'audio';
  content: string; // text for 'text' messages; local blob URL → final URL for media messages
  status: 'sending' | 'sent' | 'failed';
  timestamp: Date;
}
