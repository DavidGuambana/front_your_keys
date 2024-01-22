import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Proteccion } from '../models/proteccion';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProteccionService {

  private urlEndPoint:string = 'http://localhost:8080/api/protecciones';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Proteccion[]>{
    return this.http.get<Proteccion[]>(this.urlEndPoint);
  }
}
