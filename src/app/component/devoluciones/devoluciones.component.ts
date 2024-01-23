import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Alquiler } from 'src/app/models/alquiler';
import { Auto } from 'src/app/models/auto';
import { Cliente } from 'src/app/models/cliente';
import { Devolucion } from 'src/app/models/devolucion';
import { Persona } from 'src/app/models/persona';
import { Proteccion } from 'src/app/models/proteccion';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { AutoService } from 'src/app/services/auto.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DevolucionService } from 'src/app/services/devolucion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ProteccionService } from 'src/app/services/proteccion.service';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
})
export class DevolucionesComponent implements OnInit{
  alquileres :Alquiler[]=[];
  personas:Persona[]=[];
  clientes:Cliente[]=[];
  devoluciones:Devolucion[]=[];
  protecciones:Proteccion[]=[];
  autos:Auto[]=[];




  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private ser_alqui:AlquilerService,
    private ser_devo:DevolucionService,
    private ser_protec:ProteccionService,
    private ser_emple:EmpleadoService,
    private ser_auto:AutoService,
  ) {}

  ngOnInit() {
    this.listar();
  }
  listar() {
    forkJoin({
      devoluciones: this.ser_devo.listar(),
      alquileres: this.ser_alqui.listar(),
      autos: this.ser_auto.listar(),
      protecciones: this.ser_protec.listar(),
      clientes: this.ser_cli.listar(),
      personas: this.ser_per.listar(),  // Agrega este servicio si no lo tienes ya
    })
      .subscribe(({ devoluciones, alquileres, autos, protecciones, clientes, personas }) => {
        devoluciones.forEach((devolucion) => {
          const alquiler = alquileres.find(
            (alquiler) => alquiler.id_alquiler === devolucion.id_alquiler
          );
          if (alquiler) {
            devolucion.alquiler = alquiler;
  
            // Relacionar alquiler con auto
            const auto = autos.find(
              (auto) => auto.id_auto === alquiler.id_auto
            );
            if (auto) {
              alquiler.auto = auto;
            }
  
            // Relacionar alquiler con proteccion
            const proteccion = protecciones.find(
              (proteccion) => proteccion.id_proteccion === alquiler.id_proteccion
            );
            if (proteccion) {
              alquiler.proteccion = proteccion;
            }
  
            // Relacionar alquiler con cliente
            const cliente = clientes.find(
              (cliente) => cliente.id_cliente === alquiler.id_cliente
            );
            if (cliente) {
              alquiler.cliente = cliente;
  
              // Relacionar cliente con persona
              const persona = personas.find(
                (persona) => persona.id_persona === cliente.id_persona
              );
              if (persona) {
                cliente.persona = persona;
              }
            }
          }
        });
  
        this.devoluciones = devoluciones;
        // Llenar inicialmente devolucionesFiltradas con todas las devoluciones
        this.devoluciones = this.devoluciones;  // Asegúrate de tener la propiedad devolucionesFiltradas definida
      });
  }
  
  
  

}
