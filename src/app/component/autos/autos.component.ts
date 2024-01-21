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
import { Estado } from 'src/app/models/estado';
import { EstadoService } from 'src/app/services/estado.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'autos.component.html',
})
export class AutosComponent implements OnInit {
  autos: Auto[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  estados: Estado[] = [];

  constructor(
    private autoService: AutoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private estadoService: EstadoService,
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
      estados: this.estadoService.listar(),
    })
      .pipe(
        map(({ autos, modelos, marcas, estados }) => {
          autos.forEach(auto => {
            const modelo = modelos.find(modelo => modelo.id_modelo === auto.id_modelo);
            if (modelo) {
              auto.modelo = modelo;
            }

            const estado = estados.find(estado => estado.id_estado === auto.id_estado);
            if (estado) {
              auto.estado = estado;
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

  public delete(auto: Auto): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el auto ${auto.matricula}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.autoService.eliminar(auto.id_auto).subscribe(() => {
          this.autos = this.autos.filter(a => a.id_auto !== auto.id_auto);
          this.router.navigate(['component/autos']);
          Swal.fire('Auto eliminado', `Auto ${auto.matricula} eliminado con éxito`, 'success');
        });
      }
    });
  }
  
  
  
}
