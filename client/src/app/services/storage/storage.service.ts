import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { uploadVideoResponse } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  apiUrl = import.meta.env['NG_APP_SERVER'] ?? '';
  constructor(private http: HttpClient) {}

  uploadVideo(data: FormData) {
    return this.http.post<uploadVideoResponse>(
      `${this.apiUrl}/api/drive/upload/video`,
      data
    );
  }

  deleteVideo(id: string) {
    return this.http.delete(`${this.apiUrl}/api/drive/delete/${id}`);
  }
}
