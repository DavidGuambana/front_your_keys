import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { Modelo } from 'src/app/models/modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';


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
    private categoriaService: CategoriaService

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

}


