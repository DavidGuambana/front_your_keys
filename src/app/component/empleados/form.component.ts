import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/models/rol';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit{
  imagenUrl: string | undefined;
  nuevaImagenFile: File | undefined;
  public rol :Rol = new Rol;
  public roles: Rol[]= [];
  
constructor(
  private emp_service: EmpleadoService,
  private per_service: PersonaService,
  private rol_service: RolService
){}
  ngOnInit(): void {
    this.listarRoles();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenUrl = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }

  listarRoles() {
    this.rol_service.listar().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error al obtener roles', error);
      }
    );
  }

  onSelectIDRol(id:number):void{
    this.rol.id_rol = id;
  }
  
}
