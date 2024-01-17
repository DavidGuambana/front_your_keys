import { Component } from '@angular/core';
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
  styleUrls: ['./clientes.component.css']
  
})
export class FormComponent {
  imagenUrl: string | undefined;
  nuevaImagenFile: File | undefined;

  public cliente: Cliente = new Cliente();
  public personas: Persona[] = [];

  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private service_img: ImagenService,
    private router: Router,
    private activedRoute: ActivatedRoute
  ){}

  ngOnInit(): void{
    this.buscar();
  }
  
  buscar(): void {
    this.activedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.ser_cli.buscar(id).subscribe((cliente) => {
          this.cliente = cliente;
  
          this.ser_per.buscar(cliente.id_persona).subscribe((persona) => {
            cliente.persona = persona;
            this.cargarImagen();
          });
        });
      }
    });
  }
  
  cargarImagen(): void {
    if (this.cliente.persona.url_imagen) {
      this.service_img.getImagen(this.cliente.persona.url_imagen).subscribe((blob) => {
        this.imagenUrl = URL.createObjectURL(blob);
      });
    }
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

  public guardar(): void {
    if (this.cliente.id_cliente == 0) {
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
    if (this.nuevaImagenFile) {
      this.service_img.postImagen(this.nuevaImagenFile).subscribe((uniqueFileName: string) => {
        this.cliente.persona.url_imagen = uniqueFileName;
        this.crearCliente();
      });
    } else {
      this.crearCliente();
    }
  }
  
  editar(): void {
    if (!this.camposValidos()) {
      Swal.fire('¡Campos vacíos!', 'No se admiten campos vacíos.', 'warning');
    } else {
      // Verificar si se seleccionó una nueva imagen
      if (this.nuevaImagenFile) {
        // Subir la nueva imagen al servidor y obtener el nombre único
        this.service_img.postImagen(this.nuevaImagenFile).subscribe((uniqueFileName) => {
          // Eliminar la imagen anterior si existe
          if (this.cliente.persona.url_imagen) {
            this.service_img.deleteImagen(this.cliente.persona.url_imagen).subscribe(() => {
              console.log('Imagen anterior eliminada:', this.cliente.persona.url_imagen);
            });
          }
  
          // Asignar el nuevo nombre único al campo url_imagen
          this.cliente.persona.url_imagen = uniqueFileName;
          // Continuar con la actualización del artículo
          this.actualizarCliente();
        });
      } else {
        // No se seleccionó una nueva imagen, continuar con la actualización del artículo
        this.actualizarCliente();
      }
    }
  }
  
  private crearCliente(): void {
    this.ser_cli.crear(this.cliente).subscribe((cliente) =>{
      this.router.navigate(['/articulos']);
      Swal.fire('¡Acción exitosa!', `Cliente ${cliente.persona.nombre1+" "+cliente.persona.apellido1} creado.`, 'success')});
  }

  private actualizarCliente(): void {
    // Actualizar el artículo con o sin cambio de imagen
    this.ser_cli.editar(this.cliente).subscribe((cliente) => {
      this.router.navigate(['/articulos']);
      Swal.fire('¡Acción exitosa!', `Cliente ${cliente.persona.nombre1+" "+cliente.persona.apellido1} creado.`, 'success')});
  }

  private camposValidos(): boolean {
    return !!this.cliente.persona.cedula && !!this.cliente.persona.nombre1 && !!this.cliente.persona.nombre2 
    && !!this.cliente.persona.apellido1 && !!this.cliente.persona.apellido2
    && !!this.cliente.persona.telefono && !!this.cliente.persona.direccion
    && !!this.cliente.persona.fecha_nac && !!this.cliente.persona.correo;
  }  

}
