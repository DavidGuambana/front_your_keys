import { Auto } from "./auto";
import { Cliente } from "./cliente";
import { Empleado } from "./empleado";
import { Proteccion } from "./proteccion";
export class Alquiler{


id_alquiler:number=0;
 id_cliente:number=0;
id_auto:number=0;
id_empleado:number=0;
id_proteccion:number=0;
fecha_ini:Date=new Date;
fecha_fin:Date=new Date;
precio_auto:number=0;
precio_proteccion:number=0;
total:number=0;
tipo_pago:string="";
pagado:boolean | undefined;
reservado:boolean | undefined;
fecha_reg:string="";
auto:Auto=new Auto;
cliente:Cliente=new Cliente;
proteccion:Proteccion=new Proteccion;
empleado:Empleado=new Empleado;
  
     
}