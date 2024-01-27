import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { NgbdnavBasicComponent } from './nav/nav.component';
import { NgbdButtonsComponent } from './buttons/buttons.component';
import { TableComponent } from './table/table.component';
import { AutosComponent } from './autos/autos.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { DevolucionesComponent } from './devoluciones/devoluciones.component';
import { FormComponent as formCiente } from './clientes/form.component';
import { FormComponent as formAuto } from './autos/form.component';
import { FormComponent as formAlquiler } from './alquileres/form.component';
import { FormComponent } from './empleados/form.component';
import { ReservasComponent } from './reservas/reservas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FormComponent as formAdmin } from './admin/form.component';
import { AdminComponent } from './admin/admin.component';
import { FormproteComponent as formproteccion} from './admin/formprote.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbdpaginationBasicComponent,
    NgbdAlertBasicComponent,
    NgbdDropdownBasicComponent,
    NgbdnavBasicComponent,
    NgbdButtonsComponent,
    TableComponent,
  ],
  declarations: [
    formCiente,
    formAuto,
    formAdmin,
    formAlquiler,
    formproteccion,
    ClientesComponent,
    EmpleadosComponent,
    AutosComponent,
    FormComponent,
    AlquileresComponent,
    DevolucionesComponent,
    ReservasComponent,
    PerfilComponent,
    AdminComponent,
    AlquileresComponent,
  ],
})
export class ComponentsModule {}
