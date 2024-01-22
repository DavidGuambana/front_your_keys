import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private apiUrl = 'http://localhost:8080/api/imagenes';

  constructor(private http: HttpClient) { }
  
  postImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }

  getImagen(urlImagen: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${urlImagen}`, { responseType: 'blob' });
  }

  deleteImagen(http: string): Observable<string> {
    return this.http.delete<string>(`${http}`);
  }
}
