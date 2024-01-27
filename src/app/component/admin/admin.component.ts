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






@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls:['./admin.component.css']


})
export class AdminComponent implements OnInit {


  public marcas: Marca[] = [];
  public proteccion: Proteccion[] = [];
  public modelo: Modelo[] = [];
  public categoria: Categoria[] = [];
  



  constructor(
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
    this.proteccionService.listar().subscribe(proteccion => {
      this.proteccion = proteccion;
    })
  }

  lista3() {
    this.modeloService.listar().subscribe(modelo => {
      this.modelo = modelo;
    })
  }

  lista4() {
    this.categoriaService.listar().subscribe(categoria => {
      this.categoria = categoria;
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


  

}


