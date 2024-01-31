import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
   personas: Persona[] = [];

   constructor(
    private ser_per: PersonaService,
   ){}


  ngOnInit(): void {
    
  }

  listar() {
    
  }

}
