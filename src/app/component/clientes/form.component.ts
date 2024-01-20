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
  tipos_licencias: string[] = ['A', 'B', 'F','A1','C','C1','D','D1','E','E1','G'];

  public cliente: Cliente = new Cliente();
  public personas: Persona[] = [];

  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private service_img: ImagenService,
    private router: Router,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buscar();
  }
  
  buscar(): void {
    this.activedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.titulo = "Actualizar cliente";
        this.ser_cli.buscar(id).subscribe((cliente) => {this.cliente = cliente;
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
      this.crearCliente();
    }
  }
  
  editar(): void {
    if (!this.camposValidos()) {
      Swal.fire('¡Campos vacíos!', 'No se admiten campos vacíos.', 'warning');
    } else {
      if (this.nuevaImagenFile) {
        this.service_img.postImagen(this.nuevaImagenFile).subscribe(
          (uniqueFileName) => {
            if (this.cliente.persona.url_imagen) {
              this.service_img.deleteImagen(this.cliente.persona.url_imagen).subscribe(
                () => {
                  console.log('Imagen anterior eliminada:', this.cliente.persona.url_imagen);
                },
                (error) => {
                  console.error('Error al eliminar la imagen anterior:', error);
                }
              );
            }
    
            this.cliente.persona.url_imagen = uniqueFileName;
            this.actualizarCliente();
          },
          (error) => {
            console.error('Error al subir la nueva imagen:', error);
          }
        );
      } else {
        this.actualizarCliente();
      }
    }
  }

  private crearCliente(): void {
    this.ser_per.crear(this.cliente.persona).subscribe(
      (persona) => {
        this.cliente.id_persona = persona.id_persona;
        this.cliente.licencia = persona.cedula;
        this.ser_cli.crear(this.cliente).subscribe(
          (cliente) => {
            this.router.navigate(['/component/clientes']);
            Swal.fire('¡Acción exitosa!', `Cliente ${cliente.persona.nombre1 + ' ' + cliente.persona.apellido1} creado.`, 'success');
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

  private actualizarCliente(): void {
    this.ser_cli.editar(this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);
        Swal.fire('¡Acción exitosa!', `Cliente ${cliente.persona.nombre1 + ' ' + cliente.persona.apellido1} actualizado.`, 'success');
      },
      (error) => {
        console.error('Error al actualizar el cliente:', error);
      }
    );
  }

  private camposValidos(): boolean {
    const persona = this.cliente.persona;
    return !!(
      persona.cedula &&
      persona.nombre1 &&
      persona.nombre2 &&
      persona.apellido1 &&
      persona.apellido2 &&
      persona.telefono &&
      persona.direccion &&
      persona.fecha_nac &&
      persona.correo
    );
  }
}

