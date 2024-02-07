import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/models/marca';
import { Modelo } from 'src/app/models/modelo';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { Proteccion } from 'src/app/models/proteccion';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']

})
export class FormComponent  {
  marcasList: Marca[] = [];
  nuevoModelo: Modelo = new Modelo();
  mostrarContenido: boolean = false;
  mostrarContenido2: boolean = false;
  mostrarContenido3: boolean = false;
  mostrarContenido4: boolean = false;
  nuevaMarca: Marca=new Marca();
  nuevaProteccion:Proteccion=new Proteccion();
  nuevaCategoria:Categoria=new Categoria();
  
  public marcas: Marca[] = [];
  public proteccion: Proteccion[] = [];
  public categoria: Categoria[] = [];
  public modelo: Modelo[] = [];

  constructor(
    private modeloService: ModeloService,
    private marcaService: MarcaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ProteccionService: ProteccionService,
    private CategoriaService:CategoriaService,

 
  ) {}
  ngOnInit(): void {
 this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.marcaService.listar().subscribe(
      marcas => this.marcasList = marcas
    );
  }

  crearModelo(): void {
    if (this.nuevoModelo.nombre.trim() === '') {
      Swal.fire('¡Error!', 'El nombre del modelo no puede estar vacío.', 'error');
      return; 
    } else if (this.nuevoModelo.id_marca === 0) {
      Swal.fire('¡Error!', 'Debe seleccionar una marca.', 'error');
      return; 
    }
    this.modeloService.crear(this.nuevoModelo).subscribe(
      () => {
        this.router.navigate(['component/admin']);
        if (this.nuevoModelo.id_modelo == 0) {
          Swal.fire('¡Acción exitosa!', 'Guardado');
        }
      },
      (error) => {
        console.error('Error al crear el modelo:', error);
        if (error.status === 500) {
          Swal.fire('¡Error!', 'Los datos ingresados ya existen. Intente con valores diferentes.', 'error');
        } else {
          Swal.fire('¡Error!', 'Hubo un problema al crear el Modelo.', 'error');
        }
      }
    );
  }
  
  

  toggleContenido() {
    this.mostrarContenido = !this.mostrarContenido;
   }

   toggleContenido2() {
    this.mostrarContenido2 = !this.mostrarContenido2;
   }

   toggleContenido3() {
    this.mostrarContenido3 = !this.mostrarContenido3;
   }

   toggleContenido4() {
    this.mostrarContenido4 = !this.mostrarContenido4;
   }


   crearMarca(): void {
    if (this.nuevaMarca.nombre.trim() === '') {
      Swal.fire('¡Error!', 'El nombre de la marca no puede estar vacío.', 'error');
      return; 
    } 
    this.marcaService.crear(this.nuevaMarca).subscribe(
      () => {
        this.router.navigate(['component/marca']);
        if (this.nuevaMarca.id_marca == 0) {
          Swal.fire('¡Acción exitosa!', 'Guardado');
          this.router.navigate([ '/component/admin']);
        }
      },
      (error) => {
        console.error('Error al crear marcas:', error);
        Swal.fire('¡Error!', 'Hubo un problema al crear la Marca.', 'error');
      }
    );
  }

  crearProteccion(): void {
    if (this.nuevaProteccion.nombre.trim() === '') {
      Swal.fire('¡Error!', 'El nombre de la proteccion no puede estar vacío.', 'error');
      return; 
    } else if (this.nuevaProteccion.precio === 0) {
      Swal.fire('¡Error!', 'Debe ingresar el precio.', 'error');
      return; 
    }
    this.ProteccionService.crear(this.nuevaProteccion).subscribe(
      () => {
        this.router.navigate(['component/proteccion']);
        if (this.nuevaProteccion.id_proteccion == 0) {
          Swal.fire('¡Acción exitosa!', 'Guardado');
          this.router.navigate([ '/component/admin']);
        }
      },
      (error) => {
        console.error('Error al crear proteccion:', error);
        if (error.status === 500) {
          Swal.fire('¡Error!', 'Los datos ingresados ya existen. Intente con valores diferentes.', 'error');
        } else {
          Swal.fire('¡Error!', 'Hubo un problema al crear la Proteccion.', 'error');
        }
      }
    );
  }

  crearCategoria(): void {
    if (this.nuevaCategoria.nombre.trim() === '') {
      Swal.fire('¡Error!', 'El nombre de la categoria no puede estar vacío.', 'error');
      return; 
    } // Obtener la lista de categorías
    const nombreCategoria = this.nuevaCategoria.nombre.trim();
    if (this.categoria.some((categoria: Categoria) => categoria.nombre === nombreCategoria)) { // Se especifica el tipo de dato de 'categoria' como 'Categoria'
      Swal.fire('¡Error!', 'El nombre de la categoría ya está registrado. Intente con otro nombre.', 'error');
      return;
    }
    this.CategoriaService.crear(this.nuevaCategoria).subscribe(
      () => {
        this.router.navigate(['component/categoria']);
        if (this.nuevaCategoria.id_categoria == 0) {
          Swal.fire('¡Acción exitosa!', 'Guardado');
          this.router.navigate([ '/component/admin']);
         
        }
      },
      (error) => {
        console.error('Error al crear categoria:', error);
        if (error.status === 500) {
          Swal.fire('¡Error!', 'Los datos ingresados ya existen. Intente con valores diferentes.', 'error');
        } else {
          Swal.fire('¡Error!', 'Hubo un problema al crear la Categoria.', 'error');
        }
      }
    );
  }
}
