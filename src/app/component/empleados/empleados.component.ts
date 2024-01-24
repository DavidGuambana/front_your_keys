import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { Persona } from 'src/app/models/persona';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {
  public empleados:Empleado[] = [];
  personas:Persona [] = [];
  empleadosFiltrados: Empleado[] = [];
  filtro: string = '';


  constructor(
    private empleadoService: EmpleadoService,
    private personaService:PersonaService
  ){}
  
  ngOnInit(): void {
    this.listar();
  }
  
  listar(){
    this.empleadoService.listar().subscribe(empleados => {
      this.empleados = empleados;
  
      this.personaService.listar().subscribe(personas => {
        this.personas = personas;
  
        this.empleados.forEach(empleado => {
          const persona = this.personas.find(persona => persona.id_persona === empleado.id_persona);
          if (persona) {
            empleado.persona = persona;
          }
        });
        this.empleadosFiltrados = this.empleados;
      });
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarClientes();
  }

  public eliminar(empleado: Empleado): void {
    if (empleado.alquileres.length > 0 ) {
      if (empleado.alquileres.length > 0) {
        Swal.fire('¡Acción imposible!', `El cliente ${empleado.persona.nombre1} ${empleado.persona.apellido1} tiene ${empleado.alquileres.length === 1 ? 'un alquiler' : `${empleado.alquileres.length} alquileres`} asignado(s).`, 'warning');
      }
      return;
    } 
      this.empleadoService.eliminar(empleado.id_empleado).subscribe(() => {
        this.listar();
        Swal.fire('¡Acción exitosa!', `Empleado ${empleado.persona.nombre1 + ' ' + empleado.persona.apellido1} eliminado.`, 'success');
      });
  }

  filtrarClientes() {
    // Filtrar clientes en base al término de búsqueda
    this.empleadosFiltrados = this.empleados.filter((empleado) => {
      const textoBusqueda = `${empleado.persona.cedula} ${empleado.persona.nombre1} ${empleado.persona.apellido1} ${empleado.persona.fecha_nac} ${empleado.persona.fecha_reg}`
        .toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }
}


