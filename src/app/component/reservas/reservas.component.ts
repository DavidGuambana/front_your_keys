import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { Alquiler } from 'src/app/models/alquiler';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { AutoService } from 'src/app/services/auto.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ProteccionService } from 'src/app/services/proteccion.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
})
export class ReservasComponent implements OnInit{
  public alquileres: Alquiler[]=[];

  constructor(
    private ser_persona:PersonaService,
    private ser_cliente:ClienteService,
    private ser_auto:AutoService ,
    private ser_proteccion: ProteccionService,
    private ser_alqui: AlquilerService
    ){
  }
  ngOnInit(): void {
    
  }

  traerReservas(){
    const alquileres$ = this.ser_alqui.listar();

    const alquileresReservados$ = alquileres$.pipe(
      map(alquileres => alquileres.filter(alquiler => alquiler.reservado === true))
    );

    forkJoin([alquileres$, alquileresReservados$]).subscribe(
      ([alquileres, alquileresReservados]) => {
        // Hacer algo con los alquileres y alquileresReservados
        console.log('Todos los alquileres:', alquileres);
        console.log('Alquileres reservados:', alquileresReservados);
      },
      error => {
        // Manejar errores
        console.error('Error al obtener alquileres:', error);
      }
    );
  }
  

}
