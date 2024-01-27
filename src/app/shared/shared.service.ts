import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private habilitarBotonesSource = new BehaviorSubject<boolean>(true);
  habilitarBotones$ = this.habilitarBotonesSource.asObservable();

  actualizarHabilitarBotones(valor: boolean) {
    this.habilitarBotonesSource.next(valor);
  }
}
