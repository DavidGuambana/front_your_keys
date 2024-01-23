import { Component, OnInit } from '@angular/core';
import { Alquiler } from 'src/app/models/alquiler';
import { AutoService } from 'src/app/services/auto.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
})
export class ReservasComponent implements OnInit{
  public alquileres: Alquiler[]=[];

  constructor(
    private ser_cliente:ClienteService,
    private ser_auto:AutoService 
    ){
  }
  ngOnInit(): void {
    
  }

}
