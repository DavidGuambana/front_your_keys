import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/models/cliente'; 
import { Auto } from '../models/auto';
import { Alquiler } from '../models/alquiler';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public static clienteSeleccionado: Cliente | null = null;
  public static autoSeleccionado: Auto | null = null;
  public static reserva: Alquiler | null = null;
}
