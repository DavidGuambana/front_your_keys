import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Alquiler } from 'src/app/models/alquiler';
import { Auto } from 'src/app/models/auto';
import { Cliente } from 'src/app/models/cliente';
import { Devolucion } from 'src/app/models/devolucion';
import { Persona } from 'src/app/models/persona';
import { Proteccion } from 'src/app/models/proteccion';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { AutoService } from 'src/app/services/auto.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ProteccionService } from 'src/app/services/proteccion.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls:['./reservas.component.css']
})
export class ReservasComponent implements OnInit{
  alquileresreservados :Alquiler[]=[];
  idClientes: number[] = [];
  personas:Persona[]=[];
  public clientes:Cliente[]=[];
  public clientesFiltrados:Cliente[]=[];
  protecciones:Proteccion[]=[];
  autos:Auto[]=[];

  constructor(
    private ser_persona:PersonaService,
    private ser_cliente:ClienteService,
    private ser_auto:AutoService ,
    private ser_proteccion: ProteccionService,
    private ser_alqui: AlquilerService
    ){
  }
  ngOnInit(): void {
    this.listar();
  }

  listar() {
    forkJoin({
      alquileres: this.ser_alqui.listar(),
      autos: this.ser_auto.listar(),
      protecciones: this.ser_proteccion.listar(),
      clientes: this.ser_cliente.listar(),
      personas: this.ser_persona.listar(),
    })
    .subscribe(({ alquileres, autos, clientes, personas }) => {
      alquileres.forEach((alquilerss) => {
        if (!alquilerss.pagado) {
          // Declara la variable cliente en este ámbito
          let cliente: Cliente | undefined;
          
          // Relacionar alquiler con auto
          const auto = autos.find((auto) => auto.id_auto === alquilerss.id_auto);
          if (auto) {
            alquilerss.auto = auto;
          }
          // Relacionar alquiler con cliente
          console.log(alquilerss.id_cliente);
          cliente = clientes.find((c) => c.id_cliente === alquilerss.id_cliente);
          if (cliente) {
            alquilerss.cliente = cliente;
            console.log(alquilerss.cliente.licencia);
            // Relacionar cliente con persona
            const personaCliente = personas.find((p) => p.id_persona === alquilerss.cliente.id_persona);
            if (personaCliente) {
              alquilerss.cliente.persona = personaCliente;
              console.log(alquilerss.cliente.persona);
            }
          }
          // Relacionar alquiler con empleado
          this.alquileresreservados.push(alquilerss);
        }
      });

      console.log(this.alquileresreservados.length);
    });
    
  }

  

}
