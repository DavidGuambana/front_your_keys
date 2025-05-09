import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estado } from '../models/estado';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private urlEndPoint:string = `${environment.apiUrl}/estados`;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Estado[]>{
    return this.http.get<Estado[]>(this.urlEndPoint);
  }

  buscar(id_estado: number):Observable<Estado>{
    return this.http.get<Estado>(`${this.urlEndPoint}/${id_estado}`);
  }

  crear(estado: Estado): Observable<Estado>{
    return this.http.post<Estado>(this.urlEndPoint, estado,{headers: this.httpHeaders})
  }

  editar(estado: Estado): Observable<Estado> {
    const id_estado = `${this.urlEndPoint}/${estado.id_estado}`;
    return this.http.put<Estado>(id_estado, estado, { headers: this.httpHeaders});
  }

  eliminar(id_estado: number): Observable<Estado>{
    return this.http.delete<Estado>(`${this.urlEndPoint}/${id_estado}`)
  } 
}