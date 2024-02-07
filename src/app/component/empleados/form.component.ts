import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/models/rol';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';
import { RolService } from 'src/app/services/rol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen.service';
import { AbstractControl,FormGroup, FormControl,ValidationErrors,Validators } from '@angular/forms';
import { Empleado } from 'src/app/models/empleado';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Empl_mostrar_edicion } from 'src/app/models/Empl_mostrar_edicion';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRol } from 'src/app/models/usuario_rol';
import { UsuarioRolService } from 'src/app/services/usuario-rol.service';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{
  useringre:Usuario = new Usuario;
  public usuarioedita:string="";
  public usuariopassword:string="";
  imagenUrl: string | undefined;
  public titulo: string = "Nuevo empleado";
  nuevaImagenFile: File | undefined;
  public rol :Rol = new Rol;
  public empleado :Empleado = new Empleado();
  public roles: Rol[]= [];
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
selectedRoleId: any;
  
constructor(
  private user_service: UsuarioService,
  private emp_service: EmpleadoService,
  private service_img: ImagenService,
  private per_service: PersonaService,
  private router: Router,
  private activedRoute: ActivatedRoute,
  private usuarioRol_service:UsuarioRolService
){}
  ngOnInit(): void {
    this.buscar();
  }

  public guardar(): void {
    this.activedRoute.params.subscribe((params) => {
      let id = params['id'];
      if(id){
        this.editar();
    } else {
      this.crear();
    }
  });
  }


  buscar(): void {
    this.activedRoute.params.subscribe((params) => {
      let id = params['id'];
      if(id){
        this.titulo = "Actualizar empleado";
        this.emp_service.buscar(id).subscribe((empleado) => {
          this.empleado = empleado;
          this.user_service.listar().subscribe(
            (usuarios) => {
              const usuarioEncontrado = usuarios.find(usuario => usuario.id_persona === empleado.id_persona);
              this.per_service.buscar(empleado.id_persona).subscribe(
                (persona) => {
                  if(!usuarioEncontrado){
                    console.log('El usuario es gay');
                  }else{
                    empleado.persona = persona;
                    const empeladomostrar:Empl_mostrar_edicion = {
                    cedula: empleado.persona.cedula,
                    usuario: usuarioEncontrado.username,
                    nombre_uno:empleado.persona.nombre1,
                    nombre_dos:empleado.persona.nombre2,
                    apellido_uno:empleado.persona.apellido1,
                    apellido_dos:empleado.persona.apellido2,
                    telefono:empleado.persona.telefono,
                    direcction:empleado.persona.direccion,
                    email:empleado.persona.correo,
                    salario:empleado.salario.toString(),
                    contra:usuarioEncontrado.password,
                    id_usuario:usuarioEncontrado.id_usuario
                };
                  console.log (empleado.persona.cedula);
                  this.formEmple.patchValue(empeladomostrar);

                  }
                  
                }
              );
            },
            (error) => {
              console.error('Error al obtener la lista de usuarios:', error);
            }
          );
          
        },
        );
      }else{
        
      }
    });
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

  onSelectIDRol(id:number):void{
    this.rol.id_rol = id;
  }

  //COMANDO PARA VALIDAR CAMPOS VACÍOS: .invalid() ^\d+$
  soloLetrasValidator(control: AbstractControl) {
  const soloLetrasRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/;
  const esSoloLetras = soloLetrasRegex.test(control.value);
  return esSoloLetras ? null : { soloLetras: true };
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
            this.router.navigate(['/component/empleados']);
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
  
  esReadOnly(): boolean {
    if (this.empleado.id_empleado === 0) {
      return false
    }
    return true
  }
  private actualizarEmpleado(): void {
    this.asignarvalores();
    console.log();
    this.per_service.editar(this.empleado.persona).subscribe(
      (persona) => {
        console.log(persona);
        this.emp_service.editar(this.empleado).subscribe(
          (empleado) => {
                this.editarUsuariOnly();
          },
          (error) => {
            console.error('Error al alcualizar el empelado:', error);
          }
        );
      },
      (error) => {
        console.error('Error al alcualizar la persona:', error);
      }
    );

  }

  editar(): void {
    if (this.nuevaImagenFile) {
      this.service_img.postImagen(this.nuevaImagenFile).subscribe(

        (url_imagen: string) => {
          // Eliminar la imagen anterior si existe
          if (this.empleado.persona.url_imagen) {
            this.service_img.deleteImagen(this.empleado.persona.url_imagen);
          }
          this.empleado.persona.url_imagen = url_imagen;
          this.actualizarEmpleado();
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    } else {
      this.actualizarEmpleado();
    }
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

  public editarUsuariOnly():void{
    this.per_service.buscar(this.empleado.persona.id_persona).subscribe(
      (persona)=>{
        this.user_service.listar().subscribe(
          (usuario) =>{
            const usuarioEncontrado = usuario.find(usuario => usuario.id_persona === persona.id_persona);
            if(usuarioEncontrado){
              this.empleado.user.id_usuario = usuarioEncontrado?.id_usuario
              this.user_service.editar(this.empleado.user).subscribe(
                (usuario) => {
                  Swal.fire('¡Acción exitosa!', `Empleado ${this.empleado.persona.nombre1 + ' ' + this.empleado.persona.apellido1} actualizado.`, 'success');
                  this.router.navigate(['/component/empleados']);
                }
              );
            }
          }
        );
      }
    );
  }
}
