import { Injectable } from '@angular/core';
import { Rol } from '../models/rol';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlEndPoint:string = 'http://localhost:8080/api/roles';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Rol[]>{
    return this.http.get<Rol[]>(this.urlEndPoint);
  }

  buscar(id_rol: number):Observable<Rol>{
    return this.http.get<Rol>(`${this.urlEndPoint}/${id_rol}`);
  }

  crear(rol: Rol): Observable<Rol>{
    return this.http.post<Rol>(this.urlEndPoint, rol,{headers: this.httpHeaders})
  }

  editar(rol: Rol): Observable<Rol> {
    const id_rol = `${this.urlEndPoint}/${rol.id_rol}`;
    return this.http.put<Rol>(id_rol, rol, { headers: this.httpHeaders});
  }

  eliminar(id_rol: number): Observable<Rol>{
    return this.http.delete<Rol>(`${this.urlEndPoint}/${id_rol}`)
  }
}
