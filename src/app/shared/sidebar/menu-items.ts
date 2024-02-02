import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    rol: 'empleado',
    path: '/dashboard',
    title: 'Inicio',
    icon: 'bi bi-house-door',
    class: '',
    extralink: false,
    submenu: []
  },
  
  {
    rol: 'empleado',
    path: '/component/autos',
    title: 'Autos',
    icon: 'bi bi-car-front',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    rol: 'administrador',
    path: '/component/empleados',
    title: 'Empleados',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    rol: 'empleado',
    path: '/component/clientes',
    title: 'Cientes',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    rol: 'empleado',
    path: '/component/alquileres',
    title: 'Alquileres',
    icon: 'bi bi-bookmark',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    rol: 'empleado',
    path: '/component/devoluciones',
    title: 'Devoluciones',
    icon: 'bi bi-bookmark-check',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    rol: 'empleado',
    path: '/component/reservas',
    title: 'Reservas',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    rol: 'administrador',
    path: '/component/admin',
    title: 'Admin',
    icon: 'bi bi-person-gear',
    class: '',
    extralink: false,
    submenu: []
  }
 
];

