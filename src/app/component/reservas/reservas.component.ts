import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Alquiler } from 'src/app/models/alquiler';
import { Auto } from 'src/app/models/auto';
import { Cliente } from 'src/app/models/cliente';
import { Persona } from 'src/app/models/persona';
import { Proteccion } from 'src/app/models/proteccion';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { AutoService } from 'src/app/services/auto.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls:['./reservas.component.css']
})
export class ReservasComponent implements OnInit{

  @Output() alquilerSeleccionado = new EventEmitter<{ idCliente: number, idAuto: number }>();
  alquileresreservados :Alquiler[]=[];
  idClientes: number[] = [];
  personas:Persona[]=[];
  public clientes:Cliente[]=[];
  public clientesFiltrados:Cliente[]=[];
  protecciones:Proteccion[]=[];
  autos:Auto[]=[];
  alquilerForm!: FormGroup;

  constructor(
    private ser_persona:PersonaService,
    private ser_cliente:ClienteService,
    private ser_auto:AutoService ,
    private ser_proteccion: ProteccionService,
    private ser_alqui: AlquilerService,
    private model_service:ModeloService,
    private marca_service: MarcaService,
    private router: Router
    ){
  }
  ngOnInit(): void {
    this.listar();
  }

  listar() {
    forkJoin({
      alquileres: this.ser_alqui.listar(),
      autos: this.ser_auto.listar(),
      protecciones: this.ser_proteccion.listar(),
      clientes: this.ser_cliente.listar(),
      personas: this.ser_persona.listar(),
      modelo: this.model_service.listar(),
      marca: this.marca_service.listar()
    })
    .subscribe(({ alquileres, autos, clientes, personas,modelo,marca }) => {
      alquileres.forEach((alquilerss) => {
        if (!alquilerss.pagado) {
          // Declara la variable cliente en este ámbito
          let cliente: Cliente | undefined;
          
          // Relacionar alquiler con auto
          const auto = autos.find((auto) => auto.id_auto === alquilerss.id_auto);
          if (auto) {
            alquilerss.auto = auto;
          }
          // Relacionar alquiler con cliente
          //console.log(alquilerss.id_cliente);
          cliente = clientes.find((c) => c.id_cliente === alquilerss.id_cliente);
          if (cliente) {
            alquilerss.cliente = cliente;
            //console.log(alquilerss.cliente.licencia);
            // Relacionar cliente con persona
            const personaCliente = personas.find((p) => p.id_persona === alquilerss.cliente.id_persona);
            if (personaCliente) {
              alquilerss.cliente.persona = personaCliente;
              //console.log(alquilerss.cliente.persona);
            }
          }
          // Relacionar modelo con auto
          const ModeloIngre = modelo.find((m) => m.id_modelo === alquilerss.auto.id_modelo);
          if(ModeloIngre){
            alquilerss.auto.modelo = ModeloIngre;
          }
          //Relacionar Modelo con marca
          const Marcaauto = marca.find((mar => mar.id_marca === alquilerss.auto.modelo.id_marca));
          if(Marcaauto){
            alquilerss.auto.modelo.marca = Marcaauto; 
          }
          this.alquileresreservados.push(alquilerss);
        }
      });

      //console.log(this.alquileresreservados.length);
    });
    
  }

  alquilar(reserva: Alquiler): void {
    const idCliente = reserva.cliente.id_cliente;
    const idAuto = reserva.auto.id_auto;

    // Navegar a la ruta del formulario y pasar los parámetros
    this.router.navigate(['/component/alquileres/form'], {
      queryParams: { idCliente, idAuto },
    });
  }

}
