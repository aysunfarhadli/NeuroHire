import { http, unwrap } from './client';
import type { ApiEnvelope } from '@/types/api';

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export async function listNotifications(limit = 20) {
  const { data } = await http.get<ApiEnvelope<NotificationItem[]>>(`/api/notifications?limit=${limit}`);
  return unwrap(data);
}

export async function unreadCount() {
  const { data } = await http.get<ApiEnvelope<{ unread: number }>>('/api/notifications/unread-count');
  return unwrap(data).unread;
}

export async function markRead(id: number) {
  const { data } = await http.patch<ApiEnvelope<NotificationItem>>(`/api/notifications/${id}/read`);
  return unwrap(data);
}

export async function markAllRead() {
  const { data } = await http.patch<ApiEnvelope<{ updated: number }>>('/api/notifications/read-all');
  return unwrap(data);
}
