import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Proteccion } from '../models/proteccion';
import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProteccionService {

  private urlEndPoint:string = 'http://localhost:8080/api/protecciones';
  private urlEndPoint2:string = 'http://localhost:8080/api/protecciones/{id}';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Proteccion[]>{
    return this.http.get<Proteccion[]>(this.urlEndPoint);
  }

  crear(proteccion: Proteccion): Observable<Proteccion>{
    return this.http.post<Proteccion>(this.urlEndPoint, proteccion,{headers: this.httpHeaders})
  }

  editar(proteccion: Proteccion): Observable<Proteccion> {
    const id_proteccion = `${this.urlEndPoint}/${proteccion.id_proteccion}`;
    return this.http.put<Proteccion>(id_proteccion, proteccion, { headers: this.httpHeaders});
  }

  

  eliminar2(id_proteccion: number): Observable<Proteccion> {
    return this.http.delete<Proteccion>(`${this.urlEndPoint}/${id_proteccion}`);
  }


  getProteccion(id_proteccion: number): Observable<Proteccion> {
    const url = `${this.urlEndPoint}/${id_proteccion}`;
    return this.http.get<Proteccion>(url).pipe(
      tap((proteccion) => console.log('Proteccion obtenido:', proteccion)),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError('Error al obtener el cliente');
      })
    );
  }
}
