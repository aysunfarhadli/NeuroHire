import { http, unwrap } from './client';
import type { ApiEnvelope, CvDetail, CvSummary } from '@/types/api';

export async function uploadCv(file: File, onProgress?: (pct: number) => void) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await http.post<ApiEnvelope<{ id: number; fileName: string; parsingStatus: string }>>(
    '/api/cv/upload',
    fd,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    }
  );
  return unwrap(data);
}

export async function myCvs() {
  const { data } = await http.get<ApiEnvelope<CvSummary[]>>('/api/cv/me');
  return unwrap(data);
}

export async function getCv(id: number) {
  const { data } = await http.get<ApiEnvelope<CvDetail>>(`/api/cv/${id}`);
  return unwrap(data);
}

export async function deleteCv(id: number) {
  await http.delete(`/api/cv/${id}`);
}
