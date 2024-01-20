import { Injectable } from '@angular/core';
import { Modelo } from '../models/modelo';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  private urlEndPoint:string = 'http://localhost:8080/api/modelos';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Modelo[]>{
    return this.http.get<Modelo[]>(this.urlEndPoint);
  }

  buscar(id_modelo: number):Observable<Modelo>{
    return this.http.get<Modelo>(`${this.urlEndPoint}/${id_modelo}`);
  }

  crear(modelo: Modelo): Observable<Modelo>{
    return this.http.post<Modelo>(this.urlEndPoint, modelo,{headers: this.httpHeaders})
  }

  editar(modelo: Modelo): Observable<Modelo> {
    const id_modelo = `${this.urlEndPoint}/${modelo.id_modelo}`;
    return this.http.put<Modelo>(id_modelo, modelo, { headers: this.httpHeaders});
  }

  eliminar(id_modelo: number): Observable<Modelo>{
    return this.http.delete<Modelo>(`${this.urlEndPoint}/${id_modelo}`)
  }
}
