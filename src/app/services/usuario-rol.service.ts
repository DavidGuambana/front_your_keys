import { Injectable } from '@angular/core';
import { UsuarioRol } from '../models/usuario_rol';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {

  private urlEndPoint:string = 'http://localhost:8080/api/usuarios_roles';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<UsuarioRol[]>{
    return this.http.get<UsuarioRol[]>(this.urlEndPoint);
  }

  buscar(id_usuario_rol: number):Observable<UsuarioRol>{
    return this.http.get<UsuarioRol>('${this.urlEndPoint}/${id_usuario_rol}');
  }

  crear(usuario_rol: UsuarioRol): Observable<UsuarioRol>{
    return this.http.post<UsuarioRol>(this.urlEndPoint, usuario_rol,{headers: this.httpHeaders})
  }

  editar(usuario_rol: UsuarioRol): Observable<UsuarioRol> {
    const id_usuario_rol = '${this.urlEndPoint}/${usuario_rol.id_usuario_rol}';
    return this.http.put<UsuarioRol>(id_usuario_rol, usuario_rol, { headers: this.httpHeaders});
  }

  eliminar(id_usuario_rol: number): Observable<UsuarioRol>{
    return this.http.delete<UsuarioRol>('${this.urlEndPoint}/${id_usuario_rol}')
  }
}

