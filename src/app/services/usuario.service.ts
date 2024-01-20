import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint:string = 'http://localhost:8080/api/usuarios';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlEndPoint);
  }

  buscar(id_usuario: number):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlEndPoint}/${id_usuario}`);
  }

  crear(usuario: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(this.urlEndPoint, usuario,{headers: this.httpHeaders})
  }

  editar(usuario: Usuario): Observable<Usuario> {
    const id_usuario = `${this.urlEndPoint}/${usuario.id_usuario}`;
    return this.http.put<Usuario>(id_usuario, usuario, { headers: this.httpHeaders});
  }

  eliminar(id_usuario: number): Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.urlEndPoint}/${id_usuario}`)
  }
}
