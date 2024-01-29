import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { Auto } from 'src/app/models/auto';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Alquiler } from 'src/app/models/alquiler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Output() subtotalChanged = new EventEmitter<number>();

  public titulo: string = 'NUEVO ALQUILER';
  public alquiler: Alquiler = new Alquiler();
  alquilerForm!: FormGroup;
  proteccionList: Proteccion[] = [];
  clienteSeleccionado: Cliente | null = null;
  proteccionSeleccionada: number | null = null;
  precioProteccionSeleccionado: number | null = null;
  fechaActual!: string;
  fechaInicio: string;
  fechaFin: string;
  diasEntreFechas: number;
  numeroDiasAlquiler: number = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private proteccionService: ProteccionService,
    private fb: FormBuilder
  ) {
    this.alquilerForm = this.fb.group({
      licencia: ['', Validators.required],
      nombre: ['', Validators.required],
      matricula: ['', Validators.required],
      color: ['', Validators.required],
      potencia: ['', Validators.required],
      capacidad: ['', Validators.required],
      precio: ['', Validators.required],
      precio2: ['', Validators.required],
      estado: ['', Validators.required],
      subtotal: [0],
      fecha_inicio: ['', [Validators.required, this.validarFecha.bind(this)]],
      fecha_fin: ['', [Validators.required, this.validarFecha.bind(this)]],
    });

    this.fechaActual = new Date().toISOString().split('T')[0];
    this.fechaInicio = '';
    this.fechaFin = '';
    this.diasEntreFechas = 0;
  }

  ngOnInit(): void {
    this.agregarCliente();
    this.agregarAuto();
    this.cargarProtecciones();
    this.calcularSubtotal();
  }

  agregarCliente(): void {
    const clienteSeleccionado = this.sharedService.getClienteSeleccionado();
    if (clienteSeleccionado) {
      // Actualizar los campos en el formulario de alquiler
      this.actualizarCamposConCliente(clienteSeleccionado);
    }
  }

  newCliente(): void {
    this.router.navigate(['/component/clientes']);
  }

  public actualizarCamposConCliente(cliente: Cliente): void {
    this.alquilerForm.patchValue({
      licencia: cliente.licencia,
      nombre: `${cliente.persona.nombre1} ${cliente.persona.apellido1}`,
    });
  }

  agregarAuto(): void {
    const autoSeleccionado = this.sharedService.getAutoSeleccionado();
    if (autoSeleccionado) {
      // Actualizar los campos en el formulario de alquiler
      this.actualizarCamposConAuto(autoSeleccionado);
    }
  }

  newAuto(): void {
    this.router.navigate(['/component/autos']);
  }

  public actualizarCamposConAuto(auto: Auto): void {
    this.alquilerForm.patchValue({
      matricula: auto.matricula,
      color: auto.color,
      potencia: `${auto.potencia} hp`,
      capacidad: auto.capacidad,
      precio: `$${auto.precio_diario}/día`,
      precio2: auto.precio_diario,
      estado: auto.estado.nombre,
    });
  }

  cargarProtecciones() {
    this.proteccionService.listar().subscribe((protecciones) => {
      this.proteccionList = protecciones;
    });
  }

  seleccionarProteccion(id: number) {
    // Lógica para manejar la selección de la protección con el ID especificado
    this.proteccionSeleccionada = id;

    // Buscar el precio de la protección seleccionada
    const proteccionSeleccionada = this.proteccionList.find(
      (proteccion) => proteccion.id_proteccion === id
    );

    // Asignar el precio a la propiedad
    this.precioProteccionSeleccionado = proteccionSeleccionada
      ? proteccionSeleccionada.precio
      : null;
  }

  validarFecha(fecha: string): boolean {
    return fecha >= this.fechaActual;
  }

  actualizarDiasEntreFechas(): void {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      if (fechaInicio > fechaFin) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha en que finalizará el alquiler no puede ser anterior a la fecha en que iniciará',
        });

        this.fechaFin = '';
        this.diasEntreFechas = 0;
        this.numeroDiasAlquiler = 0;
        return;
      }

      const diferenciaEnMilisegundos = Math.abs(
        fechaFin.getTime() - fechaInicio.getTime()
      );
      // Agrega 1 al resultado para que el contador comience en uno
      this.diasEntreFechas =
        Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)) + 1;

      this.numeroDiasAlquiler = this.diasEntreFechas;
    } else {
      this.diasEntreFechas = 0;
      this.numeroDiasAlquiler = 0;
    }
  }

  calcularSubtotal(): void {
    if (
      this.precioProteccionSeleccionado !== null &&
      this.numeroDiasAlquiler !== 0
    ) {
      // Calcula el subtotal según la fórmula proporcionada
      const subtotal =
        this.precioProteccionSeleccionado * this.numeroDiasAlquiler +
        this.alquilerForm.get('precio2')?.value * this.numeroDiasAlquiler;

      // Actualiza el campo de subtotal en el formulario
      this.alquilerForm.get('subtotal')?.setValue(subtotal);

      // Emite el evento para notificar a otros componentes si es necesario
      this.subtotalChanged.emit(subtotal);
    }
  }
}
