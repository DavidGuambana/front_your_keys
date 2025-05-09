import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Devolucion } from '../models/devolucion';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {

  private urlEndPoint:string = `${environment.apiUrl}/devoluciones`;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }
  listar(): Observable<Devolucion[]>{
    return this.http.get<Devolucion[]>(this.urlEndPoint);
  }

  crear(devolucion: Devolucion): Observable<Devolucion>{
    return this.http.post<Devolucion>(this.urlEndPoint, devolucion,{headers: this.httpHeaders})
  }
}