import { Component, OnInit } from '@angular/core';
import { Empleado } from '../models/empleado';
import { Usuario } from '../models/usuario';
import { UsuarioRol } from '../models/usuario_rol';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioRolService } from '../services/usuario-rol.service';
import { Persona } from '../models/persona';
import { PersonaService } from '../services/persona.service';
import { Cliente } from '../models/cliente';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
usuarioslist:Usuario[] = [];
usuariorolist:UsuarioRol[] = [];
usuariorolist2:UsuarioRol[] = [];
personas:Persona[] = [];
empleados:Empleado[] = [];
usuario:Usuario=new Usuario;
Usuarioencontrado:Usuario=new Usuario;
usuarioRol:UsuarioRol=new UsuarioRol
usuarioEncontrado = false;
empleado:Empleado=new Empleado
persona:Persona=new Persona
constructor(private ser_usuario:UsuarioService, private router: Router ,private ser_usurol:UsuarioRolService,private ser_per:PersonaService){}

  ngOnInit() {
    this.listarusu()
    this.listarusu_rol()
    this.listar_pesonas()
  }

  listarusu() {
    this.ser_usuario.listar().subscribe(
      usuarios => {
        this.usuarioslist = usuarios;
        console.log('Usuarios obtenidos:', this.usuarioslist);
      });
  }
  listarusu_rol() {
    this.ser_usurol.listar().subscribe(
      usuariosrol => {
        this.usuariorolist = usuariosrol;
        console.log('Usuarios_rol obtenidos:', this.usuariorolist);
      });
  }
  listar_pesonas() {
    this.ser_per.listar().subscribe(
      personas => {
        this.personas = personas;
        console.log('Usuarios_rol obtenidos:', this.personas);
      });
  }
  public ingreso():boolean {
    let encontroRolNoTres: boolean = false;
  for (const usuario of this.usuarioslist) {
    if (usuario.password === this.usuario.password && usuario.username === this.usuario.username ) {
      this.usuariorolist2=usuario.usuarios_roles
      console.log('Usuarios valido obtenidos:',this.usuariorolist2); 
            for (const roles of this.usuariorolist2) {
              console.log('ingresa al segundo for:'); 
              if (this.usuariorolist2.length===1) { 
                console.log('se supone que el usuario solo tiene un rol',usuario);
                 if (roles.id_rol===3) {
                  encontroRolNoTres=false
                 }else{
                  encontroRolNoTres=true               
                 }                  
              }else{ 
                encontroRolNoTres=true       
              }
            }                 
    }
    if (encontroRolNoTres) {
      this.Usuarioencontrado=usuario
      break;
    }
  }
  return encontroRolNoTres
  }


  public detectarRol(){
     if (this.Usuarioencontrado.usuarios_roles.length===1) {      
         const usuario=this.Usuarioencontrado
         const personas=this.personas
         const personaEncontrada = this.personas.find(persona => persona.id_persona === usuario.id_persona); 
         localStorage.setItem('nombreUsuario', this.Usuarioencontrado.username);
         if (personaEncontrada?.id_persona) {
           localStorage.setItem('idPersona', personaEncontrada.id_persona.toString());
         } else {
           console.error('No se encontró la persona o no tiene un id_persona válido.');
         } 
         if (personaEncontrada?.empleados.length===1) {
          localStorage.setItem('TipoUsuario', 'empleado');
          this.router.navigate(['/dashboard']);
          ///aqui va la logica de cuando se ingresa  como empleado
         }else{
          this.router.navigate(['/dashboard']);
          localStorage.setItem('TipoUsuario', 'administrador');
          ////aqui va la logica de cuango se ingresa como admin
         }
     
            
             
       

     }

     if (this.Usuarioencontrado.usuarios_roles.length===2) {
        const usuario=this.Usuarioencontrado
        const personas=this.personas
        const personaEncontrada = this.personas.find(persona => persona.id_persona === usuario.id_persona);
        const empleado=personaEncontrada?.empleados
        if (personaEncontrada?.clientes.length===1&&personaEncontrada?.empleados.length===1) {

           //////a qui va la logica de ingreso para empleado////
           this.router.navigate(['/dashboard']);
        }
        if (personaEncontrada?.clientes.length==1&&personaEncontrada?.empleados.length!==1) {
          //////a qui va la logica de ingreso para admin////
          this.router.navigate(['/dashboard']);
       }
        if (personaEncontrada?.clientes.length!==1&&personaEncontrada?.empleados.length===1) {
        this.mostrarAlertaConOpciones() 
        localStorage.setItem('nombreUsuario', this.Usuarioencontrado.username);
        if (personaEncontrada?.id_persona) {
          localStorage.setItem('idPersona', personaEncontrada.id_persona.toString());
        } else {
          console.error('No se encontró la persona o no tiene un id_persona válido.');
        } 
        }

     }

     if (this.Usuarioencontrado.usuarios_roles.length===3) {
        const usuario=this.Usuarioencontrado
        const personas=this.personas
        const personaEncontrada = this.personas.find(persona => persona.id_persona === usuario.id_persona); 
        console.log(personaEncontrada);
        console.log('cantidad de empleador',personaEncontrada?.empleados.length);
        const empleado=personaEncontrada?.empleados
        console.log('cantidad de empleador',empleado);
        this.mostrarAlertaConOpciones()
        localStorage.setItem('nombreUsuario', this.Usuarioencontrado.username);
        if (personaEncontrada?.id_persona) {
          localStorage.setItem('idPersona', personaEncontrada.id_persona.toString());
        } else {
          console.error('No se encontró la persona o no tiene un id_persona válido.');
        }
     }
  }
  async mostrarAlertaConOpciones(): Promise<void> {
    const resultado = await Swal.fire({
      title: 'Selecciona una opción',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Empleado',
      cancelButtonText: 'Administrador',
    });
  
    if (resultado.isConfirmed) {
      localStorage.setItem('TipoUsuario', 'empleado');
      this.router.navigate(['/dashboard']);

    } else if (resultado.isDismissed && resultado.dismiss === Swal.DismissReason.cancel) {
      localStorage.setItem('TipoUsuario', 'administrador');
      this.router.navigate(['/dashboard']);

    }
  }

  public  ingresorestringido(){
   if (this.ingreso()) {
    this.detectarRol()
   // console.log('se supone que se detecto a este usuario que se supone que va a  ingresar',this.Usuarioencontrado);
   }else{
    Swal.fire('¡Acción fallida!', 'Usuario no encontrado.', 'info');
   } 
  }

}