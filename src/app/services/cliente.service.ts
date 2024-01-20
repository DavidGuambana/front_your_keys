import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  buscar(id_cliente: number):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id_cliente}`);
  }

  crear(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente,{headers: this.httpHeaders})
  }

  editar(cliente: Cliente): Observable<Cliente> {
    const id_cliente = `${this.urlEndPoint}/${cliente.id_cliente}`;
    return this.http.put<Cliente>(id_cliente, cliente, { headers: this.httpHeaders});
  }

  eliminar(id_cliente: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id_cliente}`)
  }
}
