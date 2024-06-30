import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  UploadPhotoResponse,
  UploadVideoResponse,
} from '../../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private readonly http = inject(HttpClient);

  apiUrl = import.meta.env['NG_APP_SERVER'] ?? '';

  uploadVideo(data: FormData) {
    return this.http.post<UploadVideoResponse>(
      `${this.apiUrl}/api/drive/upload/video`,
      data
    );
  }

  uploadPhoto(data: FormData) {
    return this.http.post<UploadPhotoResponse>(
      `${this.apiUrl}/api/drive/upload/photo`,
      data
    );
  }

  sendComment(data: FormData) {
    return this.http.post(`${this.apiUrl}/api/comment/send`, data);
  }

  deleteVideo(id: string) {
    return this.http.delete(`${this.apiUrl}/api/drive/delete/${id}`);
  }
}
