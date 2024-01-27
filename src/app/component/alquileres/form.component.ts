import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente';
import { Auto } from 'src/app/models/auto';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Alquiler } from 'src/app/models/alquiler';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public titulo: string = 'NUEVO ALQUILER';
  public alquiler: Alquiler = new Alquiler();
  alquilerForm!: FormGroup;
  alquilerForm2!: FormGroup;
  proteccionList: Proteccion[] = [];
  clienteSeleccionado: Cliente | null = null;
  proteccionSeleccionada: number | null = null;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private proteccionService: ProteccionService,
    private fb: FormBuilder
  ) {
    this.alquilerForm = this.fb.group({
      licencia: ['', Validators.required],
      nombre: ['', Validators.required],
    });

    this.alquilerForm2 = this.fb.group({
      matricula: ['', Validators.required],
      color: ['', Validators.required],
      potencia: ['', Validators.required],
      capacidad: ['', Validators.required],
      precio: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.agregarCliente();
    this.agregarAuto();
    this.cargarProtecciones();

  }

  agregarCliente(): void {
    const clienteSeleccionado = this.sharedService.getClienteSeleccionado();
    if (clienteSeleccionado) {
      // Actualizar los campos en el formulario de alquiler
      this.actualizarCamposConCliente(clienteSeleccionado);
    }
  }

  newCliente(): void{
    this.router.navigate(['/component/clientes']);
  }

  public actualizarCamposConCliente(cliente: Cliente): void {
    console.log('Actualizando campos con cliente:', cliente);

    this.alquilerForm.patchValue({
      licencia: cliente.licencia,
      nombre:  `${cliente.persona.nombre1} ${cliente.persona.apellido1}`
    });
  }

  agregarAuto(): void {
    const autoSeleccionado = this.sharedService.getAutoSeleccionado();
    if (autoSeleccionado) {
      // Actualizar los campos en el formulario de alquiler
      this.actualizarCamposConAuto(autoSeleccionado);
    }
  }

  newAuto(): void{
    this.router.navigate(['/component/autos']);
  }

  public actualizarCamposConAuto(auto: Auto): void {
    console.log('Actualizando campos con auto:', auto);
    // Supongamos que 'licencia', 'nombre' y 'apellido' son campos en tu formulario de alquiler
    this.alquilerForm2.patchValue({
      matricula: auto.matricula,
      color: auto.color,
      potencia: auto.potencia,
      capacidad: auto.capacidad,
      precio: auto.precio_diario,
      estado: auto.estado.nombre,
      // ...actualiza otros campos según sea necesario
    });
  }

  cargarProtecciones() {
    this.proteccionService.listar().subscribe(
      protecciones => this.proteccionList = protecciones
    );
  }

  seleccionarProteccion(id: number) {
    // Lógica para manejar la selección de la protección con el ID especificado
    this.proteccionSeleccionada = id;
    console.log("Protección seleccionada:", id);
  }
}
