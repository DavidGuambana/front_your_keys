import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { Auto } from 'src/app/models/auto';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Alquiler } from 'src/app/models/alquiler';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { AlquilerService } from 'src/app/services/alquiler.service';

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
  cliente: Cliente | null = null;
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
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private clienteService: ClienteService,
    private alquilerService: AlquilerService
  ) {
    this.alquilerForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre2: ['', Validators.required],
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
    this.route.queryParams.subscribe(params => {
      const id_cliente = params['idCliente'];
      const idAuto = params['idAuto'];
  
      if (id_cliente) {
        this.cargarInformacionCliente(id_cliente);
      }
    });
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
      cedula: cliente.persona.cedula,
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
          icon: 'warning',
          title: 'Advertencia',
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
      this.diasEntreFechas =
        Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)) + 1;

      if (this.diasEntreFechas > 30) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'El máximo de días permitidos para alquilar un vehículo es de 30 días',
        });

        this.fechaFin = '';
        this.diasEntreFechas = 0;
        this.numeroDiasAlquiler = 0;
        return;
      } else {
        this.numeroDiasAlquiler = this.diasEntreFechas;
      }
    } else {
      this.diasEntreFechas = 0;
      this.numeroDiasAlquiler = 0;
    }
  }

  calcularSubtotal(): number | null {
    const precioProteccion = this.precioProteccionSeleccionado;
    const precioAuto = this.alquilerForm.get('precio2')?.value;
    const numeroDias = this.numeroDiasAlquiler;

    // Verificar que todos los campos estén completados
    if (precioProteccion !== null && precioAuto !== null && numeroDias !== 0) {
      // Realizar el cálculo del subtotal
      const subtotal = (precioProteccion + precioAuto) * numeroDias;

      return subtotal;
    }

    // Devolver null si algún campo no está completado
    return null;
  }

  calcularTotal(): number | null {
    // Obtener el subtotal usando el método que ya creamos
    const subtotal = this.calcularSubtotal();

    // Verificar que el subtotal no sea null
    if (subtotal !== null) {
      // Calcular el total agregando el 12% de IVA
      const iva = 0.12;
      const total = subtotal * (1 + iva);

      return total;
    }

    // Devolver null si el subtotal es null
    return null;
  }

  @Input() set alquilerIds(value: { idCliente: number, idAuto: number } | null) {
    if (value) {
      // Asigna los IDs de cliente y auto al modelo de alquiler
      this.alquiler.id_cliente = value.idCliente;
      this.alquiler.id_auto = value.idAuto;
    }
  }

  cargarInformacionCliente(idCliente: number): void {
    // Llama a tu servicio de clientes para obtener la información del cliente por su ID
    this.clienteService.buscar(idCliente).subscribe(
      cliente => {
        // Verifica que el formulario esté inicializado antes de usar patchValue
        if (this.alquilerForm) {
          // Actualiza los campos en el formulario de alquiler con la información del cliente
          this.alquilerForm.patchValue({
            cedula: cliente.persona.cedula,
            nombre: `${cliente.persona.nombre1} ${cliente.persona.apellido1}`
          });
        }
      },
      error => {
        console.error('Error al cargar información del cliente:', error);
        // Maneja el error según tu lógica
      }
    );
  }

  // guardarAlquiler(): void {
  //   // Validar si hay campos vacíos
  //   if (this.alquilerForm.invalid) {
  //     // Mostrar mensaje de error o manejar la situación de campos vacíos
  //     console.error('Por favor, complete todos los campos del formulario.');
  //     return;
  //   }

  //   // Crear un nuevo objeto Alquiler con los datos del formulario
  //   const alquiler: Alquiler = {
  //     clienteId: this.alquilerForm.get('cedula')?.value,
  //     autoId: this.alquilerForm.get('matricula')?.value,
  //     fechaInicio: this.fechaInicio,  
  //     fechaFin: this.fechaFin,
  //     proteccionId: this.proteccionSeleccionada,
  //     tipoPago: this.alquilerForm.get('tipo_pago')?.value,
  //     total: this.calcularTotal() ?? 0,
  //     fechaCreacion: new Date(),
  //   };

  //   // Llama al servicio para guardar el alquiler
  //   this.alquilerService.crear(alquiler)
  //     .subscribe(
  //       (respuesta) => {
  //         // Maneja la respuesta exitosa, por ejemplo, redirige a la página de reservas
  //         console.log('Alquiler guardado con éxito:', respuesta);
  //       },
  //       (error) => {
  //         // Maneja el error, por ejemplo, muestra un mensaje de error
  //         console.error('Error al guardar el alquiler:', error);
  //       }
  //     );
  // }

  // validarCampos(): boolean {
  //   const cedula = this.alquilerForm.get('cedula')?.value;
  //   const matricula = this.alquilerForm.get('matricula')?.value;
  //   const tipoPago = this.alquilerForm.get('tipo_pago')?.value;
  
  //   // Verificar que los campos obligatorios tengan un valor
  //   if (!cedula || !matricula || !tipoPago) {

  //     console.error('Por favor, complete todos los campos obligatorios.');
  //     return false;
  //   }
  
  
  //   return true;  
  // }
  

}
