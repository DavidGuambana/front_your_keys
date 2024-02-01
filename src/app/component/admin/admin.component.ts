import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { Modelo } from 'src/app/models/modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';






@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls:['./admin.component.css']


})
export class AdminComponent implements OnInit {


  public marcas: Marca[] = [];
  public protecciones: Proteccion[] = [];
  public modelos: Modelo[] = [];
  public categorias: Categoria[] = [];
  mostrarMarca: boolean = false;
  mostrarModelo: boolean = false;
  mostrarProteccion: boolean = false;
  mostrarCategoria: boolean = false;

  constructor(
    private router: Router,
    private marcaService: MarcaService,
    private proteccionService: ProteccionService,
    private modeloService: ModeloService,
    private categoriaService: CategoriaService,
  

  ) { }

  ngOnInit(): void {
    this.listar();
    this.lista2();
    this.lista3();
    this.lista4();

  }

  listar() {
    this.marcaService.listar().subscribe(marcas => {
      this.marcas = marcas;

    });
  }

  lista2() {
    this.proteccionService.listar().subscribe(protecciones => {
      this.protecciones = protecciones;
    })
  }

  lista3() {
    this.modeloService.listar().subscribe(modelos => {
      this.modelos = modelos;
    })
  }

  lista4() {
    this.categoriaService.listar().subscribe(categorias => {
      this.categorias = categorias;
    })
  }

  
public eliminarpro(proteccion: Proteccion): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true, 
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.proteccionService.eliminar2(proteccion.id_proteccion).subscribe(
        () => {
          this.lista2();
          Swal.fire('Proteccion eliminado', 'Proteccion eliminado con éxito', 'success');
          this.lista2();
        },
        (error) => {
          // If there is an error, it logs the error in the console
          // and shows an error message
          console.error(`Error al eliminar proteccion con ID ${proteccion.id_proteccion}:`, error);
          Swal.fire('Error', 'Hubo un error al eliminar esta proteccion, esta en uso', 'error');
        }
      );
    }
  });
}

public eliminarmarca(marca: Marca): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true, 
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.marcaService.eliminar(marca.id_marca).subscribe(
        () => {
          this.listar();
          Swal.fire('Marca eliminado', 'Marca eliminado con éxito', 'success');
          this.listar();
        },
        (error) => {
          // If there is an error, it logs the error in the console
          // and shows an error message
          console.error(`Error al eliminar Marca con ID ${marca.id_marca}:`, error);
          Swal.fire('Error', 'Hubo un error al eliminar esta Marca, esta en uso', 'error');
        }
      );
    }
  });
}

public eliminarmodelo(modelo: Modelo): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true, 
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.modeloService.eliminar(modelo.id_modelo).subscribe(
        () => {
          this.lista3();
          Swal.fire('Modelo eliminado', 'Modelo eliminado con éxito', 'success');
          this.lista3();
        },
        (error) => {
          // If there is an error, it logs the error in the console
          // and shows an error message
          console.error(`Error al eliminar modelo con ID ${modelo.id_modelo}:`, error);
          Swal.fire('Error', 'Hubo un error al eliminar este modelo, esta en uso', 'error');
        }
      );
    }
  });
}

public eliminarcategoria(categoria: Categoria): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true, 
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.categoriaService.eliminar(categoria.id_categoria).subscribe(
        () => {
          this.lista3();
          Swal.fire('Cateoria eliminado', 'Categoria eliminado con éxito', 'success');
          this.lista4();
        },
        (error) => {
          // If there is an error, it logs the error in the console
          // and shows an error message
          console.error(`Error al eliminar categoria con ID ${categoria.id_categoria}:`, error);
          Swal.fire('Error', 'Hubo un error al eliminar este categoria, esta en uso', 'error');
        }
      );
    }
  });
}

abrirMarcas() {
  this.mostrarMarca = true;
  this.mostrarModelo = false;
  this.mostrarProteccion = false;
  this.mostrarCategoria = false;
 }

 abrirModelos() {
  this.mostrarMarca = false;
  this.mostrarModelo = true;
  this.mostrarProteccion = false;
  this.mostrarCategoria = false;
 }

 abrirProtecciones() {
  this.mostrarMarca = false;
  this.mostrarModelo = false;
  this.mostrarProteccion = true;
  this.mostrarCategoria = false;
 }

 abrirCategorias() {
  this.mostrarMarca = false;
  this.mostrarModelo = false;
  this.mostrarProteccion = false;
  this.mostrarCategoria = true;
 }

//Filtros:

filtro: string = '';
marcasFiltradas: Marca[] = [];
modelosFiltrados: Modelo[] = [];
proteccionesFiltrados: Proteccion[] = [];
categoriasFiltradas: Categoria[] = [];


filtrar(num: number) {
  switch (num) {
    case 1:
      this.filtrarMarcas();
      break;
    case 2:
      this.filtrarModelos();
      break;
    case 3:
      this.filtrarProtecciones();
      break;
    case 4:
      this.filtrarCategorias();
      break;
  }
}

borrarFiltros(): void {
  this.filtro = '';
  this.filtrarMarcas();
  this.filtrarModelos();
  this.filtrarProtecciones();
  this.filtrarCategorias();
}

filtrarMarcas() {
  this.marcasFiltradas = this.marcas.filter((marca) => {
    const textoBusqueda = `${marca.id_marca} ${marca.nombre}`
      .toLowerCase();
    return textoBusqueda.includes(this.filtro.toLowerCase());
  });
}

filtrarModelos() {
  this.modelosFiltrados = this.modelos.filter((modelo) => {
    const textoBusqueda = `${modelo.id_modelo} ${modelo.nombre}`
      .toLowerCase();
    return textoBusqueda.includes(this.filtro.toLowerCase());
  });
}

filtrarProtecciones() {
  this.proteccionesFiltrados = this.protecciones.filter((proteccion) => {
    const textoBusqueda = `${proteccion.id_proteccion} ${proteccion.nombre} ${proteccion.precio}`
      .toLowerCase();
    return textoBusqueda.includes(this.filtro.toLowerCase());
  });
}

filtrarCategorias() {
  this.categoriasFiltradas = this.categorias.filter((categoria) => {
    const textoBusqueda = `${categoria.id_categoria} ${categoria.nombre}`
      .toLowerCase();
    return textoBusqueda.includes(this.filtro.toLowerCase());
  });
}

borrarFiltro(): void {
  this.filtro = '';
  this.filtrarMarcas();
  this.filtrarModelos();
  this.filtrarProtecciones();
  this.filtrarCategorias();
}


}


