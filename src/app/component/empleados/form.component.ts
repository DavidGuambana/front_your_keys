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



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{
  
  imagenUrl: string | undefined;

  nuevaImagenFile: File | undefined;
  public rol :Rol = new Rol;
  public empleado :Empleado = new Empleado();
  public roles: Rol[]= [];
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
  private emp_service: EmpleadoService,
  private service_img: ImagenService,
  private per_service: PersonaService,
  private rol_service: RolService,
  private router: Router,
){}
  ngOnInit(): void {
    this.listarRoles();
  }

  public guardar(): void {
    if (this.empleado.id_empleado === 0) {
      this.crear();
    } else {
      //this.editar();
    }
  }

  crear(): void {
    //if (this.nuevaImagenFile) {
      //this.service_img.postImagen(this.nuevaImagenFile).subscribe(
        //(url_imagen: string) => {
          //this.empleado.persona.url_imagen = url_imagen;
          this.crearCliente();
        //},
        //(error) => {
          //console.error('Error al subir la imagen:', error);
        //}
      //);
    //} else {
      //this.crearCliente();
    //}
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

  //COMANDO PARA VALIDAR CAMPOS VACÍOS: .invalid() ^\d+$
  soloLetrasValidator(control: AbstractControl) {
    const soloLetrasRegex = /^[a-zA-Z ]*$/; 
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

  private crearCliente(): void {
    this.asignarvalores();
    this.per_service.crear(this.empleado.persona).subscribe(
      (persona) => {
        this.empleado.id_persona = persona.id_persona;
        this.emp_service.crear(this.empleado).subscribe(
          (empleado) => {
            this.router.navigate(['/component/empleados']);
            Swal.fire('¡Acción exitosa!', `Cliente ${empleado.persona.nombre1 + ' ' + empleado.persona.apellido1} creado.`, 'success');
          },
          (error) => {
            console.error('Error al crear el empleado:', error);
          }
        );
      },
      (error) => {
        console.error('Error al crear la persona:', error);
      }
    );
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
    }
  }
}
