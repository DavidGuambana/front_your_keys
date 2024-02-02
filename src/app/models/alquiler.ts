import { Auto } from "./auto";
import { Cliente } from "./cliente";
import { Empleado } from "./empleado";
import { Persona } from "./persona";
import { Proteccion } from "./proteccion";
export class Alquiler{
id_alquiler:number=0;
id_cliente:number=0;
id_auto:number=0;
id_empleado:number=0;
id_proteccion:number=0;
fecha_ini = new Date();
fecha_fin = new Date();
precio_auto:number=0;
precio_proteccion:number=0;
total:number=0;
tipo_pago:string="";
pagado:boolean | undefined;
reservado:boolean | undefined;
fecha_res = new Date();
fecha_reg = new Date();
auto:Auto=new Auto;
cliente:Cliente=new Cliente;
proteccion:Proteccion=new Proteccion;
persona:Persona = new Persona;
empleado:Empleado=new Empleado;
pagadoString: string = '';
}
