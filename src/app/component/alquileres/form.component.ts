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
import { DatePipe } from '@angular/common';
import { AlquilerService } from 'src/app/services/alquiler.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [DatePipe],
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
  precioProDesdeReservas: number | null = null;
  totalDesdeReservas: number | null = null;
  tipoPagoDesdeReservas: number | null = null;
  clienteAgregadoId: number | null = null;
  fechaActual!: string;
  fechaInicio: string;
  fechaFin: string;
  diasEntreFechas: number;
  numeroDiasAlquiler: number = 0;

  esReserva: boolean = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private proteccionService: ProteccionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private alquilerService: AlquilerService,
    private datePipe: DatePipe
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
      fecha_inicio: [
        '',
        [
          Validators.required,
          (control: any) => this.validarFecha(control.value, this.esReserva),
        ],
      ],
      fecha_fin: [
        '',
        [
          Validators.required,
          (control: any) => this.validarFecha(control.value, this.esReserva),
        ],
      ],
      tipo_pago: ['', Validators.required]
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
    this.route.queryParams.subscribe((params) => {
      const id_cliente = params['idCliente'];
      const idAuto = params['idAuto'];
      const idProteccionDesdeReservas = params['idProteccion'];
      const cedula = params['cedula'];
      const nombre = params['nombre'];
      const apellido = params['apellido'];
      const matricula = params['matricula'];
      const color = params['color'];
      const potencia = params['potencia'];
      const capacidad = params['capacidad'];
      const precio = params['precio'];
      const estado = params['estado'];
      const fechaIni = params['fechaIni'];
      const fechaFin = params['fechaFin'];
      const nombrePro = params['nombrePro'];
      const precioPro = params['precioPro'];
      const tipoPagoDesdeReservas = params['tipoPago'];
      this.tipoPagoDesdeReservas = tipoPagoDesdeReservas;

      const totalDesdeReservas = params['total'];
      this.totalDesdeReservas = totalDesdeReservas;

      this.alquiler.id_cliente = id_cliente;
      this.alquiler.id_auto = idAuto;
      if (idProteccionDesdeReservas) {
        // Seleccionar automáticamente la protección según el id obtenido desde reservas
        this.seleccionarProteccion(Number(idProteccionDesdeReservas));
      }
      if (tipoPagoDesdeReservas !== null) {
        // Establecer el valor del tipo de pago en el formulario
        this.alquilerForm.patchValue({
          tipo_pago: tipoPagoDesdeReservas,
        });
      }
      this.precioProDesdeReservas = precioPro ? parseFloat(precioPro) : null;
      this.alquiler.cliente.persona.cedula = cedula;
      this.alquiler.cliente.persona.nombre1 = nombre ? nombre : '';
      this.alquiler.cliente.persona.apellido1 = apellido ? apellido : '';
      this.alquiler.auto.matricula = matricula;
      this.alquiler.auto.color = color;
      this.alquiler.auto.potencia = potencia;
      this.alquiler.auto.capacidad = capacidad;
      this.alquiler.auto.precio_diario = precio;
      this.alquiler.auto.estado = estado;
      this.alquiler.fecha_ini = fechaIni;
      this.alquiler.fecha_fin = fechaFin;
      this.alquiler.proteccion.nombre = nombrePro;
      this.alquiler.proteccion.precio = precioPro;
      this.totalDesdeReservas = totalDesdeReservas;
      if (idProteccionDesdeReservas) {
        const idProteccion = Number(idProteccionDesdeReservas);
        const proteccionEncontrada = this.proteccionList.find(proteccion => proteccion.id_proteccion === idProteccion);
      
        if (proteccionEncontrada) {
          // Seleccionar automáticamente la protección según el id obtenido desde reservas
          this.seleccionarProteccion(idProteccion);
        } else {
          console.warn(`No se encontró la protección con el ID ${idProteccion}.`);
          // Puedes manejar la falta de coincidencia según tu lógica (por ejemplo, mostrar un mensaje de error).
        }
      }
    });
    
    if (this.alquiler.cliente.persona.cedula) {
      // Utilizar la cédula desde la sección de reservas para inicializar el formulario
      this.alquilerForm.patchValue({
        cedula: this.alquiler.cliente.persona.cedula,
        nombre2: `${this.alquiler.cliente.persona.nombre1} ${this.alquiler.cliente.persona.apellido1}`,
        matricula: this.alquiler.auto.matricula,
        color: this.alquiler.auto.color,
        potencia: this.alquiler.auto.potencia,
        capacidad: this.alquiler.auto.capacidad,
        precio: this.alquiler.auto.precio_diario,
        estado: this.alquiler.proteccion.precio,
        fecha_inicio: this.datePipe.transform(
          this.alquiler.fecha_ini,
          'yyyy-MM-dd'
        ),
        fecha_fin: this.datePipe.transform(
          this.alquiler.fecha_fin,
          'yyyy-MM-dd'
        ),
      });

      // También puedes cargar información adicional del cliente si lo deseas
      this.cargarInformacionCliente(this.alquiler.id_cliente);
      this.actualizarCamposConAuto(this.alquiler.auto);
      this.actualizarDiasEntreFechas();
      this.seleccionarProteccion;
      this.calcularSubtotal();
      this.calcularTotal();

    } else {

    }
  }

  findProteccionByNombreYPrecio(nombre: string, precio: number): Proteccion | undefined {
    return this.proteccionList.find(proteccion => proteccion.nombre === nombre && proteccion.precio === precio);
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
      nombre2: `${cliente.persona.nombre1} ${cliente.persona.apellido1}`,
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
      estado: auto.estado.nombre || 'Reservado',
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

  validarFecha(fecha: string, esReserva: boolean = false): boolean {
    if (esReserva) {
      return true; // No aplicar validación para fechas de reservas
    }
    return fecha >= this.fechaActual;
  }

  actualizarDiasEntreFechas(): void {
    if (
      this.alquilerForm.value.fecha_inicio &&
      this.alquilerForm.value.fecha_fin
    ) {
      const fechaInicio = new Date(this.alquilerForm.value.fecha_inicio);
      const fechaFin = new Date(this.alquilerForm.value.fecha_fin);
      if (fechaInicio > fechaFin) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'La fecha en que finalizará el alquiler no puede ser anterior a la fecha en que iniciará',
        });

        this.alquilerForm.patchValue({
          fecha_fin: null
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

        this.alquilerForm.patchValue({
          fecha_fin: null
        });

        this.fechaFin = '';
        this.diasEntreFechas = 0;
        this.numeroDiasAlquiler = 0;
        return;
      } else {
        this.numeroDiasAlquiler = this.diasEntreFechas;
      }
    } else {
      this.fechaFin = '';
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

  @Input() set alquilerIds(
    value: { idCliente: number; idAuto: number } | null
  ) {
    if (value) {
      // Asigna los IDs de cliente y auto al modelo de alquiler
      this.alquiler.id_cliente = value.idCliente;
      this.alquiler.id_auto = value.idAuto;
    }
  }

  cargarInformacionCliente(idCliente: number): void {
    // Llama a tu servicio de clientes para obtener la información del cliente por su ID
    this.clienteService.buscar(idCliente).subscribe(
      (cliente) => {
        // Verifica que el formulario esté inicializado antes de usar patchValue
        if (this.alquilerForm) {
          // Actualiza los campos en el formulario de alquiler con la información del cliente
          this.alquilerForm.patchValue({
            cedula: cliente.persona.cedula,
            nombre: `${cliente.persona.nombre1} ${cliente.persona.apellido1}`,
          });
        }
      },
      (error) => {
        console.error('Error al cargar información del cliente:', error);
        // Maneja el error según tu lógica
      }
    );
  }
  
} 
