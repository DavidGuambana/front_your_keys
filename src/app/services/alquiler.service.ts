import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alquiler } from '../models/alquiler';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  private urlEndPoint:string = 'http://localhost:8080/api/alquileres';

  constructor(private http: HttpClient) { }

  listar(): Observable<Alquiler[]>{
    return this.http.get<Alquiler[]>(this.urlEndPoint);
  }

}
