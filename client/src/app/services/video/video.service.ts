import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { VideoResponse } from 'src/app/types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private readonly http = inject(HttpClient);

  apiUrl = import.meta.env['NG_APP_SERVER'] ?? '';

  list(page: number = 1, limit: number = 10) {
    return this.http.get<VideoResponse>(`${this.apiUrl}/api/video/list`, {
      params: { page, limit },
    });
  }
}
