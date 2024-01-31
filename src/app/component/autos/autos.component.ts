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
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'autos.component.html',
})
export class AutosComponent implements OnInit {
  autos: Auto[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  estados: Estado[] = [];
  filtro: string = '';
  autosFiltrados: Auto[] = [];

  constructor(
    private autoService: AutoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private estadoService: EstadoService,
    private router: Router,
    private sharedService: SharedService
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
          autos.forEach((auto) => {
            const modelo = modelos.find(
              (modelo) => modelo.id_modelo === auto.id_modelo
            );
            if (modelo) {
              auto.modelo = modelo;
            }

            const estado = estados.find(
              (estado) => estado.id_estado === auto.id_estado
            );
            if (estado) {
              auto.estado = estado;
            }
          });

          modelos.forEach((modelo) => {
            const marca = marcas.find(
              (marca) => marca.id_marca === modelo.id_marca
            );
            if (marca) {
              modelo.marca = marca;
            }
          });

          return autos;
        })
      )
      .subscribe((autos) => {
        this.autos = autos;
        // Llenar inicialmente autosFiltrados con todos los autos
        this.autosFiltrados = this.autos;
      });
  }

  public delete(auto: Auto): void {
    if (auto.listado.length > 0) {
      Swal.fire('¡Acción imposible!', `El auto de matrícula ${auto.matricula} tiene ${auto.listado.length === 1 ? 'un alquiler' : `${auto.listado.length} alquileres`} asignado(s).`, 'warning');
      return;
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el auto ${auto.matricula}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.autoService.eliminar(auto.id_auto).subscribe(() => {
          this.autos = this.autos.filter((a) => a.id_auto !== auto.id_auto);
          this.router.navigate(['component/autos']);
          Swal.fire(
            'Auto eliminado',
            `Auto ${auto.matricula} eliminado con éxito`,
            'success'
          );
        });
      }
    });
  }

  filtrarAutos() {
    // Filtrar autos en base al término de búsqueda
    this.autosFiltrados = this.autos.filter((auto) => {
      const textoBusqueda =
        `${auto.modelo.marca.nombre} ${auto.modelo.nombre} ${auto.matricula}
      ${auto.color} ${auto.potencia} ${auto.capacidad} ${auto.precio_diario} ${auto.estado.nombre}`.toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarAutos();
  }

  seleccionarAuto(auto: Auto): void {
    if (auto.estado.nombre === 'Disponible') {
      Swal.fire({
        title: '¿Añadir este auto?',
        text: `¿Desea agregar el auto ${auto.modelo.marca.nombre} ${auto.modelo.nombre} al alquiler?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.setAutoSeleccionado(auto);
          this.router.navigate(['/component/alquileres/form']); 
        }
      });
    } else if (auto.estado.nombre === 'Alquilado') {
      Swal.fire({
        icon: 'warning',
        title: 'Auto Alquilado',
        text: 'Este auto ya está alquilado. Por favor, elige otro auto disponible.'
      });
    } else if (auto.estado.nombre === 'Reparación') {
      Swal.fire({
        icon: 'warning',
        title: 'Auto en Reparación',
        text: 'Este auto se encuentra en reparación. Por favor, elige otro auto disponible.'
      });
    }
  }
  

}
