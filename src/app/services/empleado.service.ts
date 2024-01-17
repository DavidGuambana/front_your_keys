import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private urlEndPoint:string = 'http://localhost:8080/api/empleados';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.urlEndPoint);
  }

  buscar(id_empleado: number):Observable<Empleado>{
    return this.http.get<Empleado>('${this.urlEndPoint}/${id_empleado}');
  }

  crear(empleado: Empleado): Observable<Empleado>{
    return this.http.post<Empleado>(this.urlEndPoint, empleado,{headers: this.httpHeaders})
  }

  editar(empleado: Empleado): Observable<Empleado> {
    const id_empleado = '${this.urlEndPoint}/${empleado.id_empleado}';
    return this.http.put<Empleado>(id_empleado, empleado, { headers: this.httpHeaders});
  }

  eliminar(id_rol: number): Observable<Empleado>{
    return this.http.delete<Empleado>('${this.urlEndPoint}/${id_empleado}')
  }
}
