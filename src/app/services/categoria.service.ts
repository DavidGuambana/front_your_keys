import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlEndPoint:string = 'http://localhost:8080/api/categorias';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listar(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(this.urlEndPoint);
  }

  buscar(id_categoria: number):Observable<Categoria>{
    return this.http.get<Categoria>('${this.urlEndPoint}/${id_categoria}');
  }

  crear(categoria: Categoria): Observable<Categoria>{
    return this.http.post<Categoria>(this.urlEndPoint, categoria,{headers: this.httpHeaders})
  }

  editar(categoria: Categoria): Observable<Categoria> {
    const id_categoria = '${this.urlEndPoint}/${categoria.id_categoria}';
    return this.http.put<Categoria>(id_categoria, categoria, { headers: this.httpHeaders});
  }

  eliminar(id_categoria: number): Observable<Categoria>{
    return this.http.delete<Categoria>('${this.urlEndPoint}/${id_categoria}')
  }
}
