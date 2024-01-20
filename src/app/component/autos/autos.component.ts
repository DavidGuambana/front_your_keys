import { Component, OnInit } from '@angular/core';
import { Auto } from 'src/app/models/auto';
import { AutoService } from 'src/app/services/auto.service';
import { Router } from '@angular/router';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { Modelo } from 'src/app/models/modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: 'autos.component.html',
})
export class AutosComponent implements OnInit {
  autos: Auto[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  constructor(
    private autoService: AutoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    forkJoin({
      autos: this.autoService.listar(),
      modelos: this.modeloService.listar(),
      marcas: this.marcaService.listar(),
    })
      .pipe(
        map(({ autos, modelos, marcas }) => {
          autos.forEach(auto => {
            const modelo = modelos.find(modelo => modelo.id_modelo === auto.id_modelo);
            if (modelo) {
              auto.modelo = modelo;
            }
          });

          modelos.forEach(modelo => {
            const marca = marcas.find(marca => marca.id_marca === modelo.id_marca);
            if (marca) {
              modelo.marca = marca;
            }
          });

          return autos;
        })
      )
      .subscribe(autos => {
        this.autos = autos;
      });
  }
}
