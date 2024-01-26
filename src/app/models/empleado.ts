import { Alquiler } from "./alquiler";
import { Persona } from "./persona";
import { Rol } from "./rol";
import { Usuario } from "./usuario";
import { UsuarioRol } from "./usuario_rol";

export class Empleado {
    id_empleado: number = 0;
    id_persona: number = 0;
    salario:number=0;
    persona: Persona=new Persona;
    rol: Rol = new Rol;
    user: Usuario = new Usuario; 
    userlista : UsuarioRol = new UsuarioRol;
    alquileres :Alquiler []=[];
}