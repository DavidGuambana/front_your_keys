import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  public titulo: string = "NUEVO ALQUILER";

  constructor(private router: Router, private sharedService: SharedService) {}

  agregarCliente() {
    this.router.navigate(['/component/clientes']);
  }

  agregarAuto() {
    this.router.navigate(['/component/autos']);
  }

}
