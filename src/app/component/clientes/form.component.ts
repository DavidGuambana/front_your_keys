import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Persona } from 'src/app/models/persona';
import { ClienteService } from 'src/app/services/cliente.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./clientes.component.css'],
  standalone: false
})
export class FormComponent implements OnInit {
  public titulo: string = "Nuevo cliente";
  nuevaImagenFile: File | undefined;
  tipos_licencias: string[] = ['A', 'B', 'F', 'A1', 'C', 'C1', 'D', 'D1', 'E', 'E1', 'G'];

  public cliente: Cliente = new Cliente();
  personas: Persona[] = [];
  clientes: Cliente[] = [];
  clientepersonas: Cliente[]=[];

  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private service_img: ImagenService,
    private router: Router,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buscar();
    this.listar();
  }

  listar() {
    this.ser_cli.listar().subscribe((clientes) => {
      this.clientes = clientes;
      this.ser_per.listar().subscribe((personas) => {
        this.personas = personas;
        this.clientes.forEach((cliente) => {
          const persona = this.personas.find((persona) => persona.id_persona === cliente.id_persona);
          if (persona) {
            cliente.persona = persona;
          }
        });
        this.clientepersonas = this.clientes;
        console.log('Clientes:', this.clientes);
        console.log('Personas:', this.personas);
        console.log('Clientes y Personas combinados:', this.clientepersonas);
      });
    });
  }

  

  buscar(): void {
    this.activedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.titulo = "Actualizar cliente";
        this.ser_cli.buscar(id).subscribe((cliente) => {
          this.cliente = cliente;
          this.ser_per.buscar(cliente.id_persona).subscribe(
            (persona) => {
              cliente.persona = persona;
            }
          );
        },
        );
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.cliente.persona.url_imagen = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }

  public guardar(): void {
    if (this.cliente.id_cliente === 0) {
      this.crear();
    } else {
      this.editar();
    }
  }

  crear(): void {
    if (!this.camposValidos()) {
     
      Swal.fire('¡Campos vacíos!', 'No se admiten campos vacíos.', 'warning');
      return;
    }
    if(!this.validarCedula(this.cliente.persona.cedula)){
      Swal.fire('¡Cédula Inválida!', `La cédula "${this.cliente.persona.cedula}" no cumple con la estructura válida y los requisitos específicos del formato.`, 'warning');
      return;
    }

    if (this.nuevaImagenFile) {
      this.service_img.postImagen(this.nuevaImagenFile).subscribe(
        (url_imagen: string) => {
          this.cliente.persona.url_imagen = url_imagen;
          this.crearCliente();
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    } else {
      this.crearCliente2();
    }
  }

  editar(): void {
    if (!this.camposValidos()) {
      Swal.fire('¡Campos vacíos!', 'No se admiten campos vacíos.', 'warning');
      return;
    }

    if (this.nuevaImagenFile) {
      this.service_img.postImagen(this.nuevaImagenFile).subscribe(

        (url_imagen: string) => {
          // Eliminar la imagen anterior si existe
          if (this.cliente.persona.url_imagen) {
            this.service_img.deleteImagen(this.cliente.persona.url_imagen);
          }
          this.cliente.persona.url_imagen = url_imagen;
          this.actualizarCliente();
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    } else {
      this.actualizarCliente();
    }
  }
  // Método para saber si la cédula ingresada existe inicialmente como persona
tipodeingreso(): boolean {
  return this.personas.some(persona => persona.cedula === this.cliente.persona.cedula);
}

// Método para validar si la cédula del cliente ya está registrada
validarCedularepe(): boolean {     
  return this.clientepersonas.some(cliperso => cliperso.persona.cedula === this.cliente.persona.cedula);
}

// Método para verificar si existe una persona sin cliente
existePersonaSinCliente(): boolean {
  return this.tipodeingreso() && !this.validarCedularepe();
}

// Método para validar si NO existe una persona con esos datos
validarExPersona(): boolean {
  const existePersona = this.tipodeingreso();
  Swal.fire('¡Error!', `La persona con cédula '${this.cliente.persona.cedula}' ${existePersona ? 'sí' : 'no'} existe. Intente con una diferente.`, 'error');
  return !existePersona;
}

// Método para crear un cliente con lógica mejorada
crearCliente2(): void {
  if (this.existePersonaSinCliente()) {
    // Aquí va la lógica para crear un cliente a partir de una persona previamente creada
    this.crearsoloCliente()
    //Swal.fire('¡Acción exitosa!', `Cliente ${this.cliente.licencia} creado.`, 'success');
  } else if (!this.tipodeingreso()) {
    this.crearCliente()
    // Aquí se utiliza el método normal de creación
    //Swal.fire('¡Error!', 'Aquí en teoría se ingresa desde cero.', 'error');
  } else {
    Swal.fire('¡Error!', `El cliente con cédula '${this.cliente.persona.cedula}' ya existe. Intente con una diferente.`, 'error');
  }
}



  private crearCliente(): void {
      this.ser_per.crear(this.cliente.persona).subscribe(
        (persona) => {
          this.cliente.id_persona = persona.id_persona;
          this.cliente.licencia = persona.cedula;
          this.ser_cli.crear(this.cliente).subscribe(
            (cliente) => {
              Swal.fire('¡Acción exitosa!', `Cliente ${this.cliente.persona.nombre1 + ' ' + this.cliente.persona.apellido1} creado.`, 'success');
              this.router.navigate(['/component/clientes']);
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
  private crearsoloCliente(): void {
    this.cliente.licencia = this.cliente.persona.cedula;
    let personaEncontrada: Persona | undefined;
  
    // Buscar la persona correspondiente a la cédula del cliente
    for (const persona of this.personas) {
      if (persona.cedula === this.cliente.persona.cedula) {
        personaEncontrada = persona;
        break;
      }
    }
    // Asignar valores relevantes a this.cliente desde personaEncontrada
    this.cliente.id_persona = personaEncontrada!.id_persona;
    // Crear el cliente utilizando el servicio
    this.ser_cli.crear(this.cliente).subscribe(
      (cliente) => {
        Swal.fire('¡Acción exitosa!', `Cliente ${personaEncontrada!.nombre1 + ' ' + personaEncontrada!.apellido1} creado.`, 'success');
        this.router.navigate(['/component/clientes']);     
      },
      (error) => {
        console.error('Error al crear el cliente:', error);
        // Manejar el error según sea necesario
      }
    );
  }
  
  
  
  

  private actualizarCliente(): void {
    this.ser_per.editar(this.cliente.persona).subscribe(
      (persona) => {
        this.ser_cli.editar(this.cliente).subscribe(
          (cliente) => {
            Swal.fire('¡Acción exitosa!', `Cliente ${this.cliente.persona.nombre1 + ' ' + this.cliente.persona.apellido1} actualizado.`, 'success');
            this.router.navigate(['/component/clientes']);
          },
          (error) => {
            console.error('Error al alcualizar el cliente:', error);
          }
        );
      },
      (error) => {
        console.error('Error al alcualizar la persona:', error);
      }
    );
  }

  private camposValidos(): boolean {
    const persona = this.cliente.persona;
    return !!(
      persona.cedula?.trim() &&
      persona.nombre1?.trim() &&
      persona.nombre2?.trim() &&
      persona.apellido1?.trim() &&
      persona.apellido2?.trim() &&
      persona.telefono?.trim() &&
      persona.direccion?.trim() &&
      persona.fecha_nac&&
      persona.correo?.trim()
    );
  }
  
  esReadOnly(): boolean {
    return this.cliente.id_cliente !== 0;
  }
  
  validarCedula(cedula: string): boolean {
    let cedulaCorrecta = false;
  
    try {
      if (cedula.length === 10) {
        const tercerDigito = parseInt(cedula[2]);
  
        if (tercerDigito < 6) {
          const coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
          const verificador = parseInt(cedula[9]);
          let suma = 0;
  
          for (let i = 0; i < cedula.length - 1; i++) {
            let digito = parseInt(cedula[i]) * coefValCedula[i];
            suma += Math.floor(digito % 10) + Math.floor(digito / 10);
          }
  
          if ((suma % 10 === 0) && (suma % 10 === verificador)) {
            cedulaCorrecta = true;
          } else if ((10 - (suma % 10)) === verificador) {
            cedulaCorrecta = true;
          } else {
            cedulaCorrecta = false;
          }
        } else {
          cedulaCorrecta = false;
        }
      } else {
        cedulaCorrecta = false;
      }
    } catch (error) {
      cedulaCorrecta = false;
    }
    return cedulaCorrecta;
  }
  

}

