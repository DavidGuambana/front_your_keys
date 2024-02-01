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

  public num :number = 0;
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
  }

  getMarcas() {
    this.marcaService.listar().subscribe(marcas => {
      this.marcas = marcas;
      this.marcasFiltradas = this.marcas;
      this.resultados = this.marcasFiltradas.length;
    });
  }

  getProtecciones() {
    this.proteccionService.listar().subscribe(protecciones => {
      this.protecciones = protecciones;
      this.proteccionesFiltrados = this.protecciones;
      this.resultados = this.proteccionesFiltrados.length;
    })
  }

  getModelos() {
    this.modeloService.listar().subscribe(modelos => {
      this.modelos = modelos;
      this.modelosFiltrados = this.modelos;
      this.resultados = this.modelosFiltrados.length;
    })
  }

  getCategorias() {
    this.categoriaService.listar().subscribe(categorias => {
      this.categorias = categorias;
      this.categoriasFiltradas = this.categorias;
      this.resultados = this.categoriasFiltradas.length;
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
          this.getProtecciones();
          Swal.fire('Proteccion eliminado', 'Proteccion eliminado con éxito', 'success');
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
          this.getMarcas();
          Swal.fire('Marca eliminado', 'Marca eliminado con éxito', 'success');
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
          this.getModelos();
          Swal.fire('Modelo eliminado', 'Modelo eliminado con éxito', 'success');
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
          this.getCategorias();
          Swal.fire('Cateoria eliminado', 'Categoria eliminado con éxito', 'success');
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
  this.getMarcas();
  this.num = 1;
  this.resultados = this.marcasFiltradas.length;
  this.mostrarMarca = true;
  this.mostrarModelo = false;
  this.mostrarProteccion = false;
  this.mostrarCategoria = false;
 }

 abrirModelos() {
  this.num = 2;
  this.getModelos();
  this.mostrarMarca = false;
  this.mostrarModelo = true;
  this.mostrarProteccion = false;
  this.mostrarCategoria = false;
 }

 abrirProtecciones() {
  this.num = 3;
  this.getProtecciones();
  this.mostrarMarca = false;
  this.mostrarModelo = false;
  this.mostrarProteccion = true;
  this.mostrarCategoria = false;
 }

 abrirCategorias() {
  this.num = 4;
  this.getCategorias();
  this.mostrarMarca = false;
  this.mostrarModelo = false;
  this.mostrarProteccion = false;
  this.mostrarCategoria = true;
 }

//Filtros:

resultados: number = 0;
filtro: string = '';
marcasFiltradas: Marca[] = [];
modelosFiltrados: Modelo[] = [];
proteccionesFiltrados: Proteccion[] = [];
categoriasFiltradas: Categoria[] = [];


filtrar() {
  switch (this.num) {
    case 1:
      this.filtrarMarcas();
      this.resultados = this.marcasFiltradas.length;
      break;
    case 2:
      this.filtrarModelos();
      this.resultados = this.modelosFiltrados.length;
      break;
    case 3:
      this.filtrarProtecciones();
      this.resultados = this.proteccionesFiltrados.length;
      break;
    case 4:
      this.filtrarCategorias();
      this.resultados = this.categoriasFiltradas.length;
      break;
  }
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
  this.resultados = 0;
  this.filtrar();
}
}


