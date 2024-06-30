import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http = inject(HttpClient);

  apiUrl = import.meta.env['NG_APP_SERVER'] ?? '';

  createComment(data: FormData) {
    return this.http.post(`${this.apiUrl}/api/comment/create`, data);
  }
}
