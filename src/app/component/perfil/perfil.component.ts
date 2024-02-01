import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/models/empleado';
import { Persona } from 'src/app/models/persona';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
   personas: Persona[] = [];
   empleados:Empleado[] = [];
   public persona:Persona=new Persona()
   public empleado:Empleado=new Empleado()
   public  usuario: string | null = localStorage.getItem('nombreUsuario');
   public  idpersona: string | null = localStorage.getItem('idPersona');
   public  tipousuario: string | null = localStorage.getItem('TipoUsuario');
  
   constructor(private ser_per: PersonaService, private ser_empleado:EmpleadoService, private routes:Router){}

  ngOnInit(): void {
    this.mostrar() 
    this.listarempleados()
  }
  listarempleados(): void {
    this.ser_empleado.listar().subscribe(
      empleados => {
        this.empleados = empleados;
        console.log(this.empleados); // Mueve el console.log aquí
      },
      error => {
        console.error("Error al obtener la lista de empleados:", error);
      }
    );
  }
  
mostrar() {
  if (this.idpersona !== null) {
    const idPersonaNumber = parseInt(this.idpersona, 10);
    if (!isNaN(idPersonaNumber)) {
      this.ser_per.buscar(idPersonaNumber).subscribe(
        (result: Persona) => {
          this.persona = result;
          console.log(this.persona); // Mueve el console.log aquí
        },
        (error) => {
          console.error("Error al buscar la persona:", error);
        }
      );
    } else {
      console.error("No se pudo convertir a número");
    }
  } else {
    console.error("this.idpersona es nulo");
  }
}
onImageError() {
  this.persona.url_imagen = 'assets/images/users/incognito.webp';
}
encontrarid(){
const empleadoEncontrado = this.empleados.find(empleado => empleado.id_persona === this.persona.id_persona);
this.routes.navigate(['/component/empleados/form',empleadoEncontrado?.id_empleado]);

}


}

