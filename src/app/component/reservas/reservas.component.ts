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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls:['./reservas.component.css']
})
export class ReservasComponent implements OnInit{

  @Output() alquilerSeleccionado = new EventEmitter<{ idCliente: number, idAuto: number }>();
  alquileresreservados :Alquiler[]=[];
  idClientes: number[] = [];
  alquileres:Alquiler[] = [];
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
    this.alquileresreservados = [];
    forkJoin({
      alquileres: this.ser_alqui.listar(),
      autos: this.ser_auto.listar(),
      protecciones: this.ser_proteccion.listar(),
      clientes: this.ser_cliente.listar(),
      personas: this.ser_persona.listar(),
      modelo: this.model_service.listar(),
      marca: this.marca_service.listar()
    })
    .subscribe(({ alquileres, autos, protecciones, clientes, personas, modelo, marca }) => {
      alquileres.forEach((alquilerss) => {
        if (!alquilerss.pagado) {
          let cliente: Cliente | undefined;
          let proteccion: Proteccion | undefined; // Agregamos una variable para la protección
  
          // Relacionar alquiler con auto
          const auto = autos.find((auto) => auto.id_auto === alquilerss.id_auto);
          if (auto) {
            alquilerss.auto = auto;
          }
  
          // Relacionar alquiler con cliente
          cliente = clientes.find((c) => c.id_cliente === alquilerss.id_cliente);
          if (cliente) {
            alquilerss.cliente = cliente;
  
            // Relacionar cliente con persona
            const personaCliente = personas.find((p) => p.id_persona === alquilerss.cliente.id_persona);
            if (personaCliente) {
              alquilerss.cliente.persona = personaCliente;
            }
          }
  
          // Relacionar alquiler con protección
          proteccion = protecciones.find((p) => p.id_proteccion === alquilerss.id_proteccion);
          if (proteccion) {
            alquilerss.proteccion = proteccion;
          }
  
          // Relacionar modelo con auto
          const ModeloIngre = modelo.find((m) => m.id_modelo === alquilerss.auto.id_modelo);
          if (ModeloIngre) {
            alquilerss.auto.modelo = ModeloIngre;
          }
  
          // Relacionar Modelo con marca
          const Marcaauto = marca.find((mar) => mar.id_marca === alquilerss.auto.modelo.id_marca);
          if (Marcaauto) {
            alquilerss.auto.modelo.marca = Marcaauto;
          }
  
          this.alquileresreservados.push(alquilerss);
        }
      });
    });
  }
  

  alquilar(reserva: Alquiler): void {
    const idCliente = reserva.cliente.id_cliente;
    const idAuto = reserva.auto.id_auto;
    const idProteccion = reserva.proteccion.id_proteccion;
    const cedula = reserva.cliente.persona.cedula;
    const nombre = reserva.cliente.persona.nombre1;
    const apellido = reserva.cliente.persona.apellido1;
    const matricula = reserva.auto.matricula;
    const color = reserva.auto.color;
    const potencia = reserva.auto.potencia;
    const capacidad = reserva.auto.capacidad;
    const precio = reserva.auto.precio_diario;
    const estado = 'Reservado';
    const nombrePro = reserva.proteccion.nombre;
    const precioPro = reserva.proteccion.precio;
    const fechaIni = reserva.fecha_ini;
    const fechaFin = reserva.fecha_fin;
    const tipoPago = reserva.tipo_pago;
    const total = reserva.total;
    
  
    Swal.fire({
      title: '¿Desea realizar un nuevo alquiler?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, realizar alquiler',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, realiza la navegación
        this.router.navigate(['/component/alquileres/form'], {
          queryParams: { idCliente, idAuto,idProteccion, cedula, nombre, apellido, matricula, color, 
            potencia,  capacidad, precio, estado, fechaIni, fechaFin, tipoPago, total, nombrePro, precioPro  },
        });
      }
    });
  }

  eliminarReserva(id:number,id_auto:number) {
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
        this.ser_alqui.eliminar(id).subscribe(
          (alqui) => {
            this.cambiarEstado(id_auto);
            Swal.fire('Reserva eliminada', 'Acción finalizada con éxito', 'success');
            this.listar();
          },
          (error) => {
            // If there is an error, it logs the error in the console
            // and shows an error message
            // console.error(Error al eliminar el elquiler con ID ${id}:, error);
            Swal.fire('Error', 'Hubo un error al eliminar este alquiler, esta en uso', 'error');
          }
        );
      }
    });
    }

    cambiarEstado(id_auto:number):void{
      this.ser_auto.buscar(id_auto).subscribe(
        (auto)=>{
          auto.id_estado = 1;
          this.ser_auto.editar(auto).subscribe(
            (auto)=>{
              console.log(auto);
            }
          );
          
        }
      )
    }


}
