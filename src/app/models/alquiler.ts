import { Auto } from "./auto";
import { Cliente } from "./cliente";
import { Persona } from "./persona";
import { Proteccion } from "./proteccion";
export class Alquiler{


id_alquiler:number=0;
 id_cliente:number=0;
id_auto:number=0;
id_empleado:number=0;
id_proteccion:number=0;
fecha_ini:string="";
fecha_fin:string="";
precio_auto:number=0;
precio_protección:number=0;
total:number=0;
tipo_pago:string="";
pagado:boolean | undefined;
reservado:boolean | undefined;
fecha_reg:string="";
auto:Auto=new Auto;
cliente:Cliente=new Cliente;
proteccion:Proteccion=new Proteccion;
persona:Persona = new Persona;
}