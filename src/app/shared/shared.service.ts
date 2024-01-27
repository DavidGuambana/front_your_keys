import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/models/cliente'; 
import { Auto } from '../models/auto';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private clienteSeleccionado: Cliente | null = null;
  private autoSeleccionado: Auto | null = null;

  setClienteSeleccionado(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
  }

  getClienteSeleccionado(): Cliente | null {
    return this.clienteSeleccionado;
  }

  setAutoSeleccionado(auto: Auto): void {
    this.autoSeleccionado = auto;
  }

  getAutoSeleccionado(): Auto | null {
    return this.autoSeleccionado;
  }
  
}
