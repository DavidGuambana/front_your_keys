import { Routes } from '@angular/router';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';

import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { NgbdnavBasicComponent } from './nav/nav.component';
import { BadgeComponent } from './badge/badge.component';
import { NgbdButtonsComponent } from './buttons/buttons.component';
import { AutosComponent } from './autos/autos.component';
import { TableComponent } from './table/table.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent as formCiente } from './clientes/form.component';
import { FormComponent as formAuto} from './autos/form.component';
import { FormComponent as fromEmpleado } from './empleados/form.component';
import { FormComponent as fromAdmin } from './admin/form.component';
import { ReservasComponent } from './reservas/reservas.component';
import { DevolucionesComponent } from './devoluciones/devoluciones.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './admin/admin.component';


export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'table',
				component: TableComponent
			},
			{
				path: 'autos',
				component: AutosComponent
			},
			{
				path: 'autos/form',
				component: formAuto
			},
			{
				path: 'autos/form/:id',
				component: formAuto
			},
			{
				path: 'empleados',
				component: EmpleadosComponent
			},
			{
				path: 'pagination',
				component: NgbdpaginationBasicComponent
			},
			{
				path: 'badges',
				component: BadgeComponent
			},
			{
				path: 'alert',
				component: NgbdAlertBasicComponent
			},
			{
				path: 'dropdown',
				component: NgbdDropdownBasicComponent
			},
			{
				path: 'nav',
				component: NgbdnavBasicComponent
			},
			{
				path: 'buttons',
				component: NgbdButtonsComponent
			},

			{
				path: 'clientes',
				component: ClientesComponent
			},
			{
				path: 'clientes/form',
				component: formCiente
			},
			{
				path: 'clientes/form/:id',
				component: formCiente
			},
			{
				path:'empleados/form',
				component: fromEmpleado
			},
			{
				path:'alquileres',
				component: AlquileresComponent
			},
			{
				path:'devoluciones',
				component: DevolucionesComponent
			},
			{
				path:'reservas',
				component: ReservasComponent
			},
			{
				path:'perfil',
				component: PerfilComponent
			},
			{
				path:'admin',
				component: AdminComponent
			},
			{
				path:'admin/form',
				component: fromAdmin
			}
			

		]
	}
];
