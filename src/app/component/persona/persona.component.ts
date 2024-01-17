import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit{
  empleados: Empleado[] = [];
  empleado :Empleado = new Empleado();
  
  
  public personaB: Array<any> = [];
  constructor(
    private empleadoService:EmpleadoService,
    private personaService: PersonaService
  ){}
    
  ngOnInit(): void {
    this.listarPersonas();
  }

  public listarPersonas() {
    this.personaService.listar().subscribe((resp: any) => {
      console.log(resp.data); 
      this.personaB = resp.data;
    });
  }

}

