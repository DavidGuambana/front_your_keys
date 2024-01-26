import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alquiler } from 'src/app/models/alquiler';
import { Cliente } from 'src/app/models/cliente';
import { Persona } from 'src/app/models/persona';
import { Auto } from 'src/app/models/auto';
import { ClienteService } from 'src/app/services/cliente.service';
import { PersonaService } from 'src/app/services/persona.service';
import { AutoService } from 'src/app/services/auto.service';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alquileres',
  templateUrl: './alquileres.component.html',
})
export class AlquileresComponent {
  alquileres: Alquiler[] = [];
  clientes: Cliente[] = [];
  personas: Persona[] = [];
  autos: Auto[] = [];
  alquileresFiltrados: Alquiler[] = [];
  filtro: string = '';
  subscription!: Subscription;

  constructor(
    private ser_alqui: AlquilerService,
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private ser_aut: AutoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listar();
    
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  

  listar() {
    // Obtener alquileres
    this.ser_alqui.listar().subscribe((alquileres) => {
      this.alquileres = alquileres;

      // Obtener clientes
      this.ser_cli.listar().subscribe((clientes) => {
        this.clientes = clientes;

        // Obtener personas
        this.ser_per.listar().subscribe((personas) => {
          this.personas = personas;

          // Obtener autos
          this.ser_aut.listar().subscribe((autos) => {
            this.autos = autos;

            // Asociar personas a clientes
            this.clientes.forEach((cliente) => {
              const persona = this.personas.find(
                (p) => p.id_persona === cliente.id_persona
              );
              if (persona) {
                cliente.persona = persona;
              }
            });

            // Asociar autos a alquileres
            this.alquileres.forEach((alquiler) => {
              const auto = this.autos.find(
                (a) => a.id_auto === alquiler.id_auto
              );
              if (auto) {
                alquiler.auto = auto;
              }
            });

            // Llenar inicialmente alquileresFiltrados con todos los alquileres
            this.alquileresFiltrados = this.alquileres;
          });
        });
      });
    });
  }

  filtrarAlquileres() {
    // Filtrar alquileres en base al término de búsqueda
    this.alquileresFiltrados = this.alquileres.filter((alquiler) => {
      const textoBusqueda = `${alquiler.id_alquiler} ${alquiler.fecha_ini} ${alquiler.fecha_fin} ${alquiler.total} ${alquiler.tipo_pago}`.toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }
  

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarAlquileres();
  }
}