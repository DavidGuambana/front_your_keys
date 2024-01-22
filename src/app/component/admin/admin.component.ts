import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { Modelo } from 'src/app/models/modelo';
import { ModeloService } from 'src/app/services/modelo.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {


  public marcas: Marca[] = [];
  public proteccion: Proteccion[] = [];
  public modelo: Modelo[] = [];



  constructor(
    private marcaService: MarcaService,
    private proteccionService: ProteccionService,
    private modeloService:ModeloService

  ) { }

  ngOnInit(): void {
    this.listar();
    this.lista2();
    this.lista3();

    
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

}


