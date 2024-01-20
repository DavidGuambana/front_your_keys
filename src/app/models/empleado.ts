import { Persona } from "./persona";
import { Rol } from "./rol";

export class Empleado {

    id_empleado: number = 0;
    id_persona: number = 0;
    salario:number=0;
    persona: Persona=new Persona;
    rol: Rol = new Rol;
}