import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Persona } from 'src/app/models/persona';
import { ClienteService } from 'src/app/services/cliente.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  clientes: Cliente[] = [];
  personas: Persona[] = [];
  clientesFiltrados: Cliente[] = [];
  filtro: string = '';

  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private service_img: ImagenService,
  ) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.ser_cli.listar().subscribe((clientes) => {
      this.clientes = clientes;

      this.ser_per.listar().subscribe((personas) => {
        this.personas = personas;

        this.clientes.forEach((cliente) => {
          const persona = this.personas.find((persona) => persona.id_persona === cliente.id_persona);
          if (persona) {
            cliente.persona = persona;
          }
        });

        // Llenar inicialmente clientesFiltrados con todos los clientes
        this.clientesFiltrados = this.clientes;
      });
    });
  }

  filtrarClientes() {
    // Filtrar clientes en base al término de búsqueda
    this.clientesFiltrados = this.clientes.filter((cliente) => {
      const textoBusqueda = `${cliente.persona.cedula} ${cliente.persona.nombre1} ${cliente.persona.apellido1} ${cliente.persona.fecha_nac} ${cliente.persona.fecha_reg}`
        .toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarClientes();
  }


  public eliminar(cliente: Cliente): void {
    if (cliente.alquileres.length > 0 || cliente.persona.usuarios.length > 0 || cliente.persona.empleados.length > 0) {
      if (cliente.alquileres.length > 0) {
        Swal.fire('¡Acción imposible!', `El cliente ${cliente.persona.nombre1} ${cliente.persona.apellido1} tiene ${cliente.alquileres.length === 1 ? 'un alquiler' : `${cliente.alquileres.length} alquileres`} asignado(s).`, 'warning');
      }
    
      if (cliente.persona.usuarios.length > 0) {
        Swal.fire('¡Acción imposible!', `El cliente ${cliente.persona.nombre1} ${cliente.persona.apellido1} tiene una cuenta de usuario asignado.`, 'warning');
      }
    
      if (cliente.persona.empleados.length > 0) {
        Swal.fire('¡Acción imposible!', `El cliente ${cliente.persona.nombre1} ${cliente.persona.apellido1} también es un empleado.`, 'warning');
      }
      return;
    } 
      this.ser_cli.eliminar(cliente.id_cliente).subscribe(() => {
        this.listar();
        Swal.fire('¡Acción exitosa!', `Cliente ${cliente.persona.nombre1 + ' ' + cliente.persona.apellido1} eliminado.`, 'success');
      });
  }
}
