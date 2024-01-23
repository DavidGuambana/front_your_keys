import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alquiler } from '../models/alquiler';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private urlEndPoint:string = "http://localhost:8080/api/alquiler";
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http:HttpClient){}

  listar(): Observable<Alquiler[]>{
    return this.http.get<Alquiler[]>(this.urlEndPoint);
  }

  buscar(id_alquiler: number):Observable<Alquiler>{
    return this.http.get<Alquiler>(`${this.urlEndPoint}/${id_alquiler}`);
  }

  crear(alquiler: Alquiler): Observable<Alquiler>{
    return this.http.post<Alquiler>(this.urlEndPoint, Alquiler,{headers: this.httpHeaders})
  }

  editar(alquiler: Alquiler): Observable<Alquiler> {
    const id_alquiler = `${this.urlEndPoint}/${alquiler.id_alquiler}`;
    return this.http.put<Alquiler>(id_alquiler, Alquiler, { headers: this.httpHeaders});
  }

  eliminar(id_alquiler: number): Observable<Alquiler>{
    return this.http.delete<Alquiler>(`${this.urlEndPoint}/${id_alquiler}`)
  }
}
