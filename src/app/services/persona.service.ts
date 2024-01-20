import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
private urlEndPoint:string = 'http://localhost:8080/api/personas';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Persona[]>{
    return this.http.get<Persona[]>(this.urlEndPoint);
  }

  buscar(id_persona: number):Observable<Persona>{
    return this.http.get<Persona>(`${this.urlEndPoint}/${id_persona}`);
  }

  crear(persona: Persona): Observable<Persona>{
    return this.http.post<Persona>(this.urlEndPoint, persona,{headers: this.httpHeaders})
  }

  editar(persona: Persona): Observable<Persona> {
    const id_persona = `${this.urlEndPoint}/${persona.id_persona}`;
    return this.http.put<Persona>(id_persona, persona, { headers: this.httpHeaders});
  }

  eliminar(id_persona: number): Observable<Persona>{
    return this.http.delete<Persona>(`${this.urlEndPoint}/${id_persona}`)
  }
}