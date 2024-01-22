import { Component, OnInit } from '@angular/core';
import { Auto } from 'src/app/models/auto';
import { AutoService } from 'src/app/services/auto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Marca } from 'src/app/models/marca';
import { Modelo } from 'src/app/models/modelo';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { Estado } from 'src/app/models/estado';
import { EstadoService } from 'src/app/services/estado.service';
import Swal from 'sweetalert2';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public titulo: string = "Nuevo auto";
  public auto: Auto = new Auto();
  marcasList: Marca[] = [];
  modelosList:Modelo[]=[];
  categoriaList:Categoria[]=[];
  estadoList:Estado[]=[];
  imagenUrl: string | undefined;
  nuevaImagenFile: File | undefined;
  id_marca:any;

  constructor(
    private service_img: ImagenService,
    private autoService: AutoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private categoriaService:CategoriaService,
    private estadoService:EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarAuto();
    this.cargarMarcas();
    //this.cargarModeloss();
    this.cargarCategorias();
    this.cargarEstado();
  }


  cargarAuto(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.titulo = "Actualizar auto";
        this.autoService.buscar(id).subscribe(auto => this.auto = auto);
      }
    });
  }

  cargarMarcas(): void {
    this.marcaService.listar().subscribe(
      marcas => this.marcasList = marcas
    );
  }
  cargarModeloss(): void {
    this.modeloService.listar().subscribe(
      modelos => this.modelosList = modelos
    );
  }
  cargarCategorias() {
    this.categoriaService.listar().subscribe(
      categorias => this.categoriaList = categorias
    );
  }
  cargarEstado() {
    this.estadoService.listar().subscribe(
      estados => {
        this.estadoList = estados;
        console.log('Lista de estados:', this.estadoList);
      }
    );
  }
  cargarModelos(): void {
    console.log('Marca seleccionada:', this.id_marca);
    this.modeloService.listar().subscribe(
      modelos => {
        this.modelosList = modelos;
        this.modelosList = this.modelosList.filter(modelo => modelo.id_marca === this.id_marca);
        console.log('Modelos filtrados:', this.modelosList);
      }
    );
  }

  validateForm(): boolean {
    // Verificar si los campos obligatorios están llenos
    if (
      !this.auto ||
      !this.auto.matricula ||
      !this.auto.id_modelo ||
      !this.auto.id_estado ||
      !this.auto.color ||
      !this.auto.capacidad ||
      !this.auto.potencia ||
      !this.auto.precio_diario ||
      !this.auto.id_categoria // Agregamos la validación para id_categoria
    ) {
      Swal.fire('¡Error!', 'Por favor, completa todos los campos obligatorios.', 'error');
      return false;
    }
    return true;
  }

  create(): void {
    if (this.validateForm()) {
      if (this.nuevaImagenFile) {
        this.service_img.postImagen(this.nuevaImagenFile).subscribe(
          (url_imagen: string) => {

            // Eliminar la imagen anterior si existe
            if (this.auto.url_imagen && this.titulo == "Actualizar auto") {
              this.service_img.deleteImagen(this.auto.url_imagen);
            }

            this.auto.url_imagen = url_imagen;
            this.crearAuto();
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
          }
        );
      } else {
        this.crearAuto();
      }
    }
  }

  crearAuto(){
    this.autoService.crear(this.auto).subscribe(
      () => {
        this.router.navigate(['component/autos']);
        Swal.fire('¡Acción exitosa!', `Auto Placa ${this.auto.matricula} creado.`, 'success');
      },
      (error) => {
        console.error('Error al crear el auto:', error);

        // Verificar si el error es específico para datos duplicados
        if (error.status === 500) {
          Swal.fire('¡Error!', 'Los datos ingresados ya existen. Intente con valores diferentes.', 'error');
        } else {
          Swal.fire('¡Error!', 'Hubo un problema al crear el auto.', 'error');
        }
      }
    );
  }
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.auto.url_imagen = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }

}   
