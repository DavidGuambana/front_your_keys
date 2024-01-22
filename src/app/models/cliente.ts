
import { Alquiler } from "./alquiler";
import { Persona } from "./persona";

export class Cliente {

    id_cliente: number = 0;
    id_persona: number = 0;
    licencia: string = '';
    tipo_licencia: string = '';
    alquileres: Alquiler []= [];
    
    persona: Persona = new Persona;
}
