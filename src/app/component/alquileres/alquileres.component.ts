import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Alquiler } from 'src/app/models/alquiler';
import { Cliente } from 'src/app/models/cliente';
import { Persona } from 'src/app/models/persona';
import { Auto } from 'src/app/models/auto';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { AutoService } from 'src/app/services/auto.service';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { Modelo } from 'src/app/models/modelo';
import { ModeloService } from 'src/app/services/modelo.service';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { FormComponent } from './form.component';
import { Observable, interval } from 'rxjs';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { DevolucionService } from 'src/app/services/devolucion.service';
import { Devolucion } from 'src/app/models/devolucion';

@Component({
  selector: 'app-alquileres',
  templateUrl: './alquileres.component.html',
})
export class AlquileresComponent implements OnInit {
  alquileres: Alquiler[] = [];
  clientes: Cliente[] = [];
  personas: Persona[] = [];
  formComponent: FormComponent[] = [];
  autos: Auto[] = [];
  modelos: Modelo[] = [];
  marcas: Marca[] = [];
  alquileresFiltrados: Alquiler[] = [];
  filtro: string = '';
  providers!: [AsyncPipe];
  devolucion:Devolucion =new Devolucion;

  constructor(
    private ser_alqui: AlquilerService,
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private ser_aut: AutoService,
    private ser_mod: ModeloService,
    private ser_mar: MarcaService,
    private ser_devoluciones:DevolucionService
  ) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    forkJoin({
      alquileres: this.ser_alqui.listar(),
      clientes: this.ser_cli.listar(),
      personas: this.ser_per.listar(),
      autos: this.ser_aut.listar(),
      modelos: this.ser_mod.listar(),
      marcas: this.ser_mar.listar(),
    }).subscribe(
      ({ alquileres, clientes, personas, autos, modelos, marcas }) => {
        // Filtrar alquileres con pagado igual a 1
        alquileres = alquileres.filter(alquiler => alquiler.pagado === true);
  
        alquileres.forEach((alquiler) => {
          const cliente = clientes.find(
            (cliente) => cliente.id_cliente === alquiler.id_cliente
          );
          if (cliente) {
            alquiler.cliente = cliente;
  
            const personaCliente = personas.find(
              (persona) => persona.id_persona === cliente.id_persona
            );
            if (personaCliente) {
              cliente.persona = personaCliente;
            }
          }
          
          const auto = autos.find((auto) => auto.id_auto === alquiler.id_auto);
          if (auto) {
            alquiler.auto = auto;
  
            const modelo = modelos.find(
              (modelo) => modelo.id_modelo === auto.id_modelo
            );
            if (modelo) {
              auto.modelo = modelo;
  
              const marca = marcas.find(
                (marca) => marca.id_marca === modelo.id_marca
              );
              if (marca) {
                modelo.marca = marca;
              }
            }
          }


          alquiler.pagadoString = "Pagado";
        });
  
        this.alquileres = alquileres;
        this.alquileresFiltrados = alquileres;
      }
    );
  }

  filtrarAlquileres() {
    this.alquileresFiltrados = this.alquileres.filter((alquiler) => {
      const estado = alquiler.pagado ? 'Pagado' : 'Pendiente';
      const textoBusqueda =
        `${alquiler.cliente.persona.nombre1} ${alquiler.cliente.persona.apellido1} ${alquiler.auto.modelo.marca.nombre} ${alquiler.auto.modelo.nombre}
         ${alquiler.fecha_ini} ${alquiler.fecha_fin} ${alquiler.total} ${estado}`.toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.alquileresFiltrados = this.alquileres;
  }

  calcularTiempoRestante(alquiler: Alquiler): Observable<string> {
    return interval(1000).pipe(
      startWith(0),
      map(() => {
        const fechaInicio = new Date(alquiler.fecha_ini).getTime();
        const fechaFin = new Date(alquiler.fecha_fin).getTime();
        const ahora = new Date().getTime();

        const tiempoRestanteMs = fechaFin - ahora;

        if (tiempoRestanteMs <= 0) {
          return 'Alquiler finalizado';
        }

        const dias = Math.floor(tiempoRestanteMs / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (tiempoRestanteMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutos = Math.floor(
          (tiempoRestanteMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const segundos = Math.floor((tiempoRestanteMs % (1000 * 60)) / 1000);

        return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
      }),
      takeWhile((tiempoRestante) => tiempoRestante !== 'Alquiler finalizado')
    );
  }

eliminar(alquiler:Alquiler){
  //his.devolucion.id_alquiler = alquiler.id_alquiler;

  //this.ser_devoluciones.crear().subscribe(
    //(devolucion)=>{

    //}
 // )
}

}
