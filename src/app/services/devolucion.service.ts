import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Devolucion } from '../models/devolucion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {

  private urlEndPoint:string = 'http://localhost:8080/api/devoluciones';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }
  listar(): Observable<Devolucion[]>{
    return this.http.get<Devolucion[]>(this.urlEndPoint);
  }
}