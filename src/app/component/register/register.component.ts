import { Component } from '@angular/core';
import { AbstractControl,FormGroup, FormControl,ValidationErrors,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleado } from 'src/app/models/empleado';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRol } from 'src/app/models/usuario_rol';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioRolService } from 'src/app/services/usuario-rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public empleado :Empleado = new Empleado();
  nuevaImagenFile: File | undefined;
  useringre:Usuario = new Usuario;
  public relacionUR:UsuarioRol = new UsuarioRol;
  formEmple = new FormGroup({
    'cedula': new FormControl('',[Validators.required,this.soloNumerosValidator]),
    'usuario' : new FormControl('',Validators.required),
    'nombre_uno' : new FormControl('',[Validators.required,this.soloLetrasValidator]),
    'nombre_dos' : new FormControl('',[Validators.required,this.soloLetrasValidator]),
    'email' : new FormControl('',[Validators.required, Validators.email]),
    'salario' : new FormControl('',[Validators.required, this.decimalValidator]),
    'telefono' : new FormControl('',[Validators.required, this.soloNumerosValidator]),
    'contra' : new FormControl('', Validators.required),
    'apellido_uno' : new FormControl('',[Validators.required,this.soloLetrasValidator]),
    'apellido_dos' : new FormControl('',[Validators.required,this.soloLetrasValidator]),
    'direcction' : new FormControl('',Validators.required)
  });
 
  constructor(
    private user_service: UsuarioService,
    private emp_service: EmpleadoService,
    private service_img: ImagenService,
    private per_service: PersonaService,
    private router: Router,
    private activedRoute: ActivatedRoute,
   private usuarioRol_service:UsuarioRolService
  ){}

  esReadOnly(): boolean {
    if (this.empleado.id_empleado === 0) {
      return false
    }
    return true
  }

  //VALIDACIONES DE LOS INPUT
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

  decimalValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    // Validar solo si el campo no está vacío
    if (valor && valor.trim() !== '') {
      const esDecimalValido = /^\d+(\.\d+)?$/.test(valor);
      return esDecimalValido ? null : { decimal: true };
    }
    // Si el campo está vacío, no aplicar la validación
    return null;
  }

  soloNumerosValidator(control: AbstractControl) {
    const valor = control.value;
    if (valor && valor.trim() !== '') {
    const soloNumeros = /^[\d]{10,10}$/; // regex para cédula
    const esCedulaValida = soloNumeros.test(control.value);
    return esCedulaValida ? null : { cedula: true };
    }
    return null;
  }

  soloLetrasValidator(control: AbstractControl) {
    const soloLetrasRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
    const esSoloLetras = soloLetrasRegex.test(control.value);
    return esSoloLetras ? null : { soloLetras: true };
  }

  public asignarvalores(){
    const cedula = this.formEmple.get('cedula')?.value;
    const nombre1 = this.formEmple.get('nombre_uno')?.value;
    const nombre2 = this.formEmple.get('nombre_dos')?.value;
    const usuario = this.formEmple.get('usuario')?.value;
    const correo = this.formEmple.get('email')?.value;
    const salario = this.formEmple.get('salario')?.value;
    const telefono = this.formEmple.get('telefono')?.value;
    const contraseña = this.formEmple.get('contra')?.value;
    const apellido1 = this.formEmple.get('apellido_uno')?.value;
    const apellido2 = this.formEmple.get('apellido_dos')?.value;
    const direccion = this.formEmple.get('direcction')?.value;
    if(cedula && nombre1 && nombre2 && usuario && correo && salario && telefono && contraseña && apellido1 && apellido2 &&direccion){
      this.empleado.user = this.empleado.user || {};
      this.empleado.persona.cedula = cedula;
      this.empleado.persona.nombre1 = nombre1;
      this.empleado.persona.nombre2 = nombre2;
      this.empleado.user.username = usuario;
      this.empleado.persona.correo = correo;
      this.empleado.salario = parseFloat(salario);
      this.empleado.persona.telefono = telefono;
      this.empleado.user.password = contraseña;
      this.empleado.persona.apellido1 = apellido1;
      this.empleado.persona.apellido2 = apellido2;
      this.empleado.persona.direccion = direccion;
    }else{
      Swal.fire('Error en la actualización de empleado', 'success');
      this.router.navigate(['/component/clientes']);
    }
  }

  crear(): void {
    this.asignarvalores();
    if (this.nuevaImagenFile) {
      this.service_img.postImagen(this.nuevaImagenFile).subscribe(
        (url_imagen: string) => {
          this.empleado.persona.url_imagen = url_imagen;
          this.crearEmpleado();
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    } else {
      this.crearEmpleado();
    }
  }

  private crearEmpleado(): void {
    this.per_service.crear(this.empleado.persona).subscribe(
      (persona) => {
        this.empleado.id_persona = persona.id_persona;
        this.useringre.id_persona = persona.id_persona;
        this.emp_service.crear(this.empleado).subscribe(
          (cliente) => {
            console.log(persona.id_persona);
            this.relacionarUsuario(persona.id_persona);
            Swal.fire('¡Acción exitosa!', `Empleado ${this.empleado.persona.nombre1 + ' ' + this.empleado.persona.apellido1} creado.`, 'success');
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error al crear el cliente:', error);
          }
        );
      },
      (error) => {
        console.error('Error al crear la persona:', error);
      }
    );
  }

  public relacionarUsuario(vairbale:number):void{
    this.useringre.id_persona = vairbale;
    this.useringre.id_usuario=0;
    this.useringre.username = this.empleado.user.username;
    this.useringre.password = this.empleado.user.password;
    console.log(this.useringre.id_persona,this.useringre.username,this.useringre.password)
    this.user_service.crear(this.useringre).subscribe(
      (useringre)=>{
        this.relacionarusuarioRol(useringre.id_usuario);
        Swal.fire('¡Acción exitosa!', `Empleado ${useringre.password + ' ' + useringre.id_usuario} creado.`, 'success');
      },
      (error) =>{
        console.error('Error en la relación de usuario y persona',error)
      }
    );
  }

  public relacionarusuarioRol(id_usuario:number):void{
    this.relacionUR.id_usuario = id_usuario;
    this.relacionUR.id_rol = 2;
    this.usuarioRol_service.crear(this.relacionUR).subscribe(
      (usuarioRol)=>{
        console.log(usuarioRol.id_usuario_rol);
        Swal.fire('¡Acción exitosa segunda relación hecho!', `Empleado`, 'success');
      },
      (error) =>{

      }
    );
  }


}
