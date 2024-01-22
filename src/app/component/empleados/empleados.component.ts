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
      });
    });
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
}


