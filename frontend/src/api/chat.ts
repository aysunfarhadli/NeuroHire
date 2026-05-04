import { http, unwrap } from './client';
import type { ApiEnvelope } from '@/types/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatReply {
  reply: string;
  suggestedActions: string[];
}

export async function sendChat(messages: ChatMessage[], audience: 'GUEST' | 'CANDIDATE' | 'HR' | 'SUPER_ADMIN') {
  const { data } = await http.post<ApiEnvelope<ChatReply>>('/api/ai/chat', { messages, audience });
  return unwrap(data);
}
