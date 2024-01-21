import { Alquiler } from "./alquiler";
import { Estado } from "./estado";
import { Marca } from "./marca";
import { Modelo } from "./modelo";

export class Auto {
    id_auto: number = 0;
    matricula: string = "";
    id_modelo: number = 0;
    id_categoria: number = 0;
    color: string = "";
    capacidad:number=0;
    potencia:number =0;
    precio_diario:number = 0;
    url_imagen:string ="";
    id_estado:number = 0;
    listado: Alquiler []= [];
    modelo:Modelo=new Modelo;
    estado:Estado=new Estado;
}