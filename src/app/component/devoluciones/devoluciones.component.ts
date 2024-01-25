import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { jsPDF } from 'jspdf';
import { Alquiler } from 'src/app/models/alquiler';
import { Auto } from 'src/app/models/auto';
import { Cliente } from 'src/app/models/cliente';
import { Devolucion } from 'src/app/models/devolucion';
import { Empleado } from 'src/app/models/empleado';
import { Persona } from 'src/app/models/persona';
import { Proteccion } from 'src/app/models/proteccion';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { AutoService } from 'src/app/services/auto.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DevolucionService } from 'src/app/services/devolucion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ProteccionService } from 'src/app/services/proteccion.service';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
})
export class DevolucionesComponent implements OnInit {
  doc = new jsPDF();
  alquileres: Alquiler[] = [];
  personas: Persona[] = [];
  clientes: Cliente[] = [];
  empleados: Empleado[] = [];
  devoluciones: Devolucion[] = [];
  devolucionesfiltradas: Devolucion[] = [];
  protecciones: Proteccion[] = [];
  autos: Auto[] = [];
  filtro: string = '';

  constructor(
    private ser_cli: ClienteService,
    private ser_per: PersonaService,
    private ser_alqui: AlquilerService,
    private ser_devo: DevolucionService,
    private ser_protec: ProteccionService,
    private ser_emple: EmpleadoService,
    private ser_auto: AutoService
  ) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    forkJoin({
      devoluciones: this.ser_devo.listar(),
      alquileres: this.ser_alqui.listar(),
      autos: this.ser_auto.listar(),
      protecciones: this.ser_protec.listar(),
      clientes: this.ser_cli.listar(),
      empleados: this.ser_emple.listar(),
      personas: this.ser_per.listar(),
    }).subscribe(({ devoluciones, alquileres, autos, protecciones, clientes, empleados, personas }) => {
      devoluciones.forEach((devolucion) => {
        const alquiler = alquileres.find((alquiler) => alquiler.id_alquiler === devolucion.id_alquiler);
        if (alquiler) {
          devolucion.alquiler = alquiler;

          const auto = autos.find((auto) => auto.id_auto === alquiler.id_auto);
          if (auto) {
            alquiler.auto = auto;
          }

          const proteccion = protecciones.find((proteccion) => proteccion.id_proteccion === alquiler.id_proteccion);
          if (proteccion) {
            alquiler.proteccion = proteccion;
          }

          const cliente = clientes.find((cliente) => cliente.id_cliente === alquiler.id_cliente);
          if (cliente) {
            alquiler.cliente = cliente;

            const personaCliente = personas.find((persona) => persona.id_persona === cliente.id_persona);
            if (personaCliente) {
              cliente.persona = personaCliente;
            }
          }

          const empleado = empleados.find((empleado) => empleado.id_empleado === alquiler.id_empleado);
          if (empleado) {
            alquiler.empleado = empleado;

            const personaEmpleado = personas.find((persona) => persona.id_persona === empleado.id_persona);
            if (personaEmpleado) {
              empleado.persona = personaEmpleado;
            }
          }
        }
      });

      this.devoluciones = devoluciones;
      this.devolucionesfiltradas= devoluciones;
    });
  }
   filtrarDevoluciones() {

    this.devoluciones = this.devoluciones.filter((devolucion) => {
      const textoBusqueda =
        `${devolucion.alquiler.cliente.persona.nombre1} ${devolucion.alquiler.cliente.persona.apellido1} ${devolucion.alquiler.cliente.persona.cedula}
      ${devolucion.alquiler.auto.matricula} ${devolucion.alquiler.fecha_ini} ${devolucion.fecha} ${devolucion.alquiler.total}`.toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.devoluciones;
  }

  

  generatePdf(devolucionId: number): void{
    const devolucion = this.devoluciones.find(dev => dev.id_devolucion === devolucionId);
    const doc = new jsPDF();
    const fechaInicio = new Date('' + devolucion?.alquiler.fecha_ini);
    const fechaFin = new Date('' + devolucion?.alquiler.fecha_fin);
    let dias : number = calcularDiferenciaEnDias(fechaInicio, fechaFin);
    let total = 0;
    let total2: number = 0; 
    let sumatotales :number =0; 
    let ivacalculado :number =0;
    let totalgeneral :number =0;
    if (dias !== undefined && devolucion?.alquiler.precio_auto !== undefined) {
        const resultadoMultiplicacion = (dias * devolucion.alquiler.precio_auto)/1.12;
        const resultadoseguro = (dias * devolucion.alquiler.precio_proteccion)/1.12;
        total = Number(resultadoMultiplicacion.toFixed(2));
        total2 = Number(resultadoseguro.toFixed(2));
        sumatotales= Number ((total+total2).toFixed(2));
        ivacalculado = Number(((total + total2 * 1.12) * 0.12).toFixed(2));
        totalgeneral = Number((sumatotales + ivacalculado).toFixed(2));


    } else {
        console.error('No se pueden realizar la multiplicación, días o precio_auto no están definidos correctamente.');
    }
   
    // Encabezado
    const imageWidth = 60;  
    const imageHeight = 40;  
    const imageURL = './assets/images/logos/logo.jpg';  // Ruta de tu imagen
    doc.addImage(imageURL, 'JPEG', 20, 20, imageWidth, imageHeight);
// Información del cliente (debajo de la imagen)
const customerInfoY = 70; // Ajusta la posición en Y según sea necesario
const borderStyle1 = { lineWidth: 0.8, lineColor: [0, 0, 0] };
const box1X = 15;
const box1Y = customerInfoY - 5;
const box1Width = 85; // Modifica la anchura según sea necesario (la mitad del eje X)
const box1Height = 35;
const borderRadius1 = 1; // Ajusta el radio de las esquinas según sea necesario

doc.setDrawColor(borderStyle1.lineColor[0], borderStyle1.lineColor[1], borderStyle1.lineColor[2]);
doc.setLineWidth(borderStyle1.lineWidth);
doc.roundedRect(box1X, box1Y, box1Width, box1Height, borderRadius1, borderRadius1, 'S'); // 'S' indica trazo

doc.setFontSize(10);
doc.text('Edisson Ariel Guaman Parra', box1X + 5, customerInfoY);
doc.text('YOUR KEYS', box1X + 5, customerInfoY + 10);
doc.text('Dirección: Av de las Americas', box1X + 5, customerInfoY + 20);

const borderStyle2 = { lineWidth: 0.8, lineColor: [0, 0, 0] };

const box2X = box1X + box1Width + 10; 
const box2Y = customerInfoY - 50;
const box2Width = 85; 
const box2Height = 80;
const borderRadius2 = 1; 

doc.setDrawColor(borderStyle2.lineColor[0], borderStyle2.lineColor[1], borderStyle2.lineColor[2]);
doc.setLineWidth(borderStyle2.lineWidth);
doc.roundedRect(box2X, box2Y, box2Width, box2Height, borderRadius2, borderRadius2, 'S'); // 'S' indica trazo


doc.text('R.U.C.:    0107940033', box2X + 5, box2Y + 5);
doc.text('FACTURA', box2X + 5, box2Y + 20); 
doc.text('No. 001-100-000000'+devolucion?.id_devolucion, box2X + 5, box2Y +30);
doc.text('FECHA Y HORA DE \nAUTORIZACION: '+devolucion?.fecha, box2X + 5, box2Y +40); 

const borderStyle3 = { lineWidth: 0.8, lineColor: [0, 0, 0] };

const box3X = 15; // Inicia desde la izquierda
const box3Y = box2Y + box2Height + 10; // Ajusta la separación entre las cajas según sea necesario
const box3Width = 180; // Ocupa todo el ancho
const box3Height = 50; // Ajusta la altura según sea necesario
const borderRadius3 = 1; // Ajusta el radio de las esquinas según sea necesario

doc.setDrawColor(borderStyle3.lineColor[0], borderStyle3.lineColor[1], borderStyle3.lineColor[2]);
doc.setLineWidth(borderStyle3.lineWidth);
doc.roundedRect(box3X, box3Y, box3Width, box3Height, borderRadius3, borderRadius3, 'S'); // 'S' indica trazo


doc.text('Razón Social / Nombres y Apellidos: '+devolucion?.alquiler.cliente.persona.nombre1+" "+devolucion?.alquiler.cliente.persona.nombre2 +" "+devolucion?.alquiler.cliente.persona.apellido1 +" "+devolucion?.alquiler.cliente.persona.apellido2 , box3X + 5, box3Y + 5); // Ajusta la posición del texto dentro de la caja
doc.text('Identificación: '+devolucion?.alquiler.cliente.persona.cedula, box3X + 5, box3Y + 13); // Ajusta la posición del texto dentro de la caja
doc.text('Fecha:' +devolucion?.fecha, box3X + 5, box3Y + 21); // Ajusta la posición del texto dentro de la caja
doc.text('Direccion: '+devolucion?.alquiler.cliente.persona.direccion, box3X + 5, box3Y + 29); // Ajusta la posición del texto dentro de la caja
doc.text('Telefono: '+devolucion?.alquiler.cliente.persona.telefono, box3X + 5, box3Y + 37); // Ajusta la posición del texto dentro de la caja
doc.text('Correo: '+devolucion?.alquiler.cliente.persona.correo, box3X + 5, box3Y + 46); // Ajusta la posición del texto dentro de la caja

    const tableY = customerInfoY + 100;  // Ajusta la posición en Y según sea necesario
  
    autoTable(doc, {
      head: [['Cod.\nprincipal', 'Descripción', 'Detalle adicional', 'Precio Unitario', 'Descuento', 'Precio Total']],
      body: [
        [ '1','Servicio uso de vehiculo', 'Precio:'+devolucion?.alquiler.auto.precio_diario+'$'+' Dias:'+ dias, ''+total,'0',+total],
        [ '2','Seguro: '+devolucion?.alquiler.proteccion.nombre,'Precio: '+devolucion?.alquiler.precio_proteccion+'$'+' Dias:'+ dias,''+total2, '0',''+total2],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40'
      },
      startY: tableY  // Especifica la posición Y de inicio para la tabla
    });
 // Definir el ancho total de la página
const totalWidth = doc.internal.pageSize.width;
// Calcular la posición para que la tabla comience desde la mitad
const startX = totalWidth / 2+25;
// Definir la posición Y de inicio para la segunda tabla
// Configurar la alineación y la posición de la segunda tabla
autoTable(doc, {
    body: [
        [
            { content: 'SUBTOTAL 12%', styles: { halign: 'left' } },
            { content: sumatotales, styles: { halign: 'center' } },
        ],
        [
            { content: 'IVA 12%', styles: { halign: 'left' } },
            { content: ivacalculado, styles: { halign: 'center' } },
        ],
        [
            { content: 'VALOR TOTAL', styles: { halign: 'left' } },
            { content: totalgeneral, styles: { halign: 'center' } },
        ],
    ],
    theme: 'striped',
    margin: { left: startX }, // Establecer el margen izquierdo para que comience desde la mitad
});
autoTable(doc, {
  body: [
      [
          { content: 'Forma de Pago', styles: { halign: 'left' } },
          { content: devolucion?.alquiler.tipo_pago, styles: { halign: 'left' } },
      ],
      [
          { content: 'Valor', styles: { halign: 'left' } },
          { content: totalgeneral, styles: { halign: 'left' } },
      ],
      [
        { content: 'Empleado que atendio', styles: { halign: 'left' } },
        { content: devolucion?.alquiler.empleado.persona.nombre1+' '+devolucion?.alquiler.empleado.persona.apellido1, styles: { halign: 'left' } },
    ],
  ],
  theme: 'striped',
  margin: { right: startX }, // Establecer el margen izquierdo para que comience desde la mitad
});


  
  
  doc.setLineWidth(1);
    // Guardar y mostrar el PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
  }
  
}
function calcularDiferenciaEnDias(fechaInicio: Date, fechaFin: Date): number {
  const tiempoInicio = fechaInicio.getTime();
  const tiempoFin = fechaFin.getTime();
  // Calcular la diferencia en milisegundos
  const diferenciaEnMilisegundos = tiempoFin - tiempoInicio;
  // Convertir la diferencia a días
  const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
  return diferenciaEnDias;
}

