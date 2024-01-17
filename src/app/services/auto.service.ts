import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auto } from '../models/auto';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  private urlEndPoint:string = 'http://localhost:8080/api/autos';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Auto[]>{
    return this.http.get<Auto[]>(this.urlEndPoint);
  }

  buscar(id_auto: number):Observable<Auto>{
    return this.http.get<Auto>('${this.urlEndPoint}/${id_auto}');
  }

  crear(auto: Auto): Observable<Auto>{
    return this.http.post<Auto>(this.urlEndPoint, auto,{headers: this.httpHeaders})
  }

  editar(auto: Auto): Observable<Auto> {
    const id_auto = '${this.urlEndPoint}/${auto.id_auto}';
    return this.http.put<Auto>(id_auto, auto, { headers: this.httpHeaders});
  }

  eliminar(id_auto: number): Observable<Auto>{
    return this.http.delete<Auto>('${this.urlEndPoint}/${id_auto}')
  }
}
