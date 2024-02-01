import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Empleado } from '../models/empleado';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
 
  public empleado :Empleado = new Empleado();
  nuevaImagenFile: File | undefined;
  formEmple = new FormGroup({

  });
 

  esReadOnly(): boolean {
    if (this.empleado.id_empleado === 0) {
      return false
    }
    return true
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.empleado.persona.url_imagen = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }
}
