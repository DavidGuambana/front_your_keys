import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private apiUrl = 'http://localhost:8080/api/imagenes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getImagen(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  postImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }

  deleteImagen(filename: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${filename}`, { responseType: 'text' });
  }
}