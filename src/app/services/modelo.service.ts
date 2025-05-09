import { Injectable } from '@angular/core';
import { Modelo } from '../models/modelo';
import { Observable,throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  private urlEndPoint: string = `${environment.apiUrl}/modelos`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  listar(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.urlEndPoint);
  }

  buscar(id_modelo: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.urlEndPoint}/${id_modelo}`);
  }

  crear(modelo: Modelo): Observable<Modelo> {
    return this.http.post<Modelo>(this.urlEndPoint, modelo, { headers: this.httpHeaders })
  }

  editar(modelo: Modelo): Observable<Modelo> {
    const id_modelo = `${this.urlEndPoint}/${modelo.id_modelo}`;
    return this.http.put<Modelo>(id_modelo, modelo, { headers: this.httpHeaders });
  }

  eliminar(id_modelo: number): Observable<Modelo> {
    return this.http.delete<Modelo>(`${this.urlEndPoint}/${id_modelo}`);
  }

  eliminar2(id_modelo: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.urlEndPoint}/${id_modelo}`).pipe(
      switchMap((modelo: Modelo) => {
        if (modelo.marca.id_marca === 0) {
          // Si el modelo no está asociado a ninguna marca, se puede eliminar
          return this.http.delete<Modelo>(`${this.urlEndPoint}/${id_modelo}`);
        } else {
          // Si el modelo está asociado a una marca, lanzamos un error
          return throwError('El modelo está asociado a una marca y no se puede eliminar');
        }
      })
    );
  }

  getModelo(id_modelo: number): Observable<Modelo> {
    const url = `${this.urlEndPoint}/${id_modelo}`;
    return this.http.get<Modelo>(url).pipe(
      tap((modelo) => console.log('Modelo obtenido:', modelo)),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError('Error al obtener el modelo');
      })
    );
  }
}
