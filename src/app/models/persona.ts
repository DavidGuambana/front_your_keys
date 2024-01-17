import { Cliente } from "./cliente";
import { Empleado } from "./empleado";
import { Usuario } from "./usuario";

export class Persona {
    id_persona: number = 0;
    cedula: string = '';
    nombre1: string = '';
    nombre2: string = '';
    apellido1: string = '';
    apellido2: string = '';
    telefono: string = '';
    direccion: string = '';
    fecha_nac: Date = new Date();
    correo: string = '';
    url_imagen: string = '';
    fecha_reg: Date = new Date();
    empleados: Empleado[] = [];
    clientes: Cliente[] = [];
    usuarios: Usuario[] = [];
}