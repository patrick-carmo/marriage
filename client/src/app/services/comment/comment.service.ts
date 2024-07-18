import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CommentResponse } from 'src/app/types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http = inject(HttpClient);

  apiUrl = import.meta.env['NG_APP_SERVER'];

  list(page: number = 1, limit: number = 10) {
    return this.http.get<CommentResponse>(`${this.apiUrl}/comment/list`, {
      params: { page, limit },
    });
  }

  create(data: FormData) {
    return this.http.post(`${this.apiUrl}/comment/create`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/comment/delete/${id}`);
  }
}
