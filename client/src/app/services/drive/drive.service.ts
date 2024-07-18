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

  apiUrl = import.meta.env['NG_APP_SERVER'];

  uploadVideo(data: FormData) {
    return this.http.post<UploadVideoResponse>(
      `${this.apiUrl}/drive/upload/video`,
      data
    );
  }

  uploadPhoto(data: FormData) {
    return this.http.post<UploadPhotoResponse>(
      `${this.apiUrl}/drive/upload/photo`,
      data
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/drive/delete/${id}`);
  }
}
