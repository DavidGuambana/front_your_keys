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
  styleUrls:['./admin.component.css']

})
export class FormComponent  {
  marcasList: Marca[] = [];
  nuevoModelo: Modelo = new Modelo();
  public modelo: Modelo = new Modelo();
  mostrarContenido: boolean = false;
  mostrarContenido2: boolean = false;
  mostrarContenido3: boolean = false;
  mostrarContenido4: boolean = false;
  nuevaMarca: Marca=new Marca();
  nuevaProteccion:Proteccion=new Proteccion();
  nuevaCategoria:Categoria=new Categoria();

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
    // Realizar lógica para crear el modelo utilizando this.nuevoModelo
    this.modeloService.crear(this.nuevoModelo).subscribe(
      // Manejar la respuesta o realizar acciones adicionales si es necesario
      () => {
        this.router.navigate(['component/modelo']);
        if(this.nuevoModelo.id_modelo==0){
          Swal.fire('¡Acción exitosa!', 'Guardado');
        }
      },
      (error) => {
        console.error('Error al crear el modelo:', error);

        // Verificar si el error es específico para datos duplicados
        if (error.status === 500) {
          Swal.fire('¡Error!', 'Los datos ingresados ya existen. Intente con valores diferentes.', 'error');
        } else {
          Swal.fire('¡Error!', 'Hubo un problema al crear el auto.', 'error');
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
    this.marcaService.crear(this.nuevaMarca).subscribe(
      () => {
        this.router.navigate(['component/marca']);
        if (this.nuevaMarca.id_marca == 0) {
          Swal.fire('¡Acción exitosa!', 'Guardado');
          this.router.navigate([ '/component/admin']);
        }
      },
      (error) => {
        console.error('Error al crear la marca:', error);
        if (error.status === 500) {
          Swal.fire('¡Error!', 'Los datos ingresados ya existen. Intente con valores diferentes.', 'error');
        } else {
          Swal.fire('¡Error!', 'Hubo un problema al crear la marca.', 'error');
        }
      }
    );
  }

  crearProteccion(): void {
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
          Swal.fire('¡Error!', 'Hubo un problema al crear la proteccion.', 'error');
        }
      }
    );
  }

  crearCategoria(): void {
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
          Swal.fire('¡Error!', 'Hubo un problema al crear la categoria.', 'error');
        }
      }
    );
  }
}
