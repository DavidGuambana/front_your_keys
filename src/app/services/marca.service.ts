import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Marca } from "../models/marca";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class MarcaService {
  
    private urlEndPoint:string = 'http://localhost:8080/api/marcas';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  
    constructor(private http: HttpClient) { }
  
    listar(): Observable<Marca[]>{
      return this.http.get<Marca[]>(this.urlEndPoint);
    }
  
    buscar(id_marca: number):Observable<Marca>{
      return this.http.get<Marca>('${this.urlEndPoint}/${id_marca}');
    }
  
    crear(marca: Marca): Observable<Marca>{
      return this.http.post<Marca>(this.urlEndPoint, marca,{headers: this.httpHeaders})
    }
  
    editar(marca: Marca): Observable<Marca> {
      const id_marca = '${this.urlEndPoint}/${marca.id_marca}';
      return this.http.put<Marca>(id_marca, marca, { headers: this.httpHeaders});
    }
  
    eliminar(id_marca: number): Observable<Marca>{
      return this.http.delete<Marca>('${this.urlEndPoint}/${id_cliente}')
    }
}