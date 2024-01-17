import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Persona } from 'src/app/models/persona';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  
})
export class ClientesComponent {
  clientes: Cliente[] = [];
  personas: Persona[] = [];


  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
  ){}

  ngOnInit(){
    this.listar();
  }

  listar(){
    this.ser_cli.listar().subscribe(clientes => {
      this.clientes = clientes;

      this.ser_per.listar().subscribe(personas => {
        this.personas = personas;

        this.clientes.forEach(cliente => {
          const persona = this.personas.find(persona => persona.id_persona === cliente.id_persona);
          if (persona) {
            cliente.persona = persona;
          }
        });
      });
    });
  }

  public eliminar(cliente: Cliente): void {
    this.ser_cli.eliminar(cliente.id_cliente)
      .subscribe(() => {
        this.listar();
        Swal.fire('¡Acción exitosa!', `Cliente ${cliente.persona.nombre1+" "+cliente.persona.apellido1} eliminado.`, 'success');
      });
  }
}

