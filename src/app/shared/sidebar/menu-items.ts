import { RouteInfo } from './sidebar.metadata';

// Declarar RutasAdmin primero
const RutasAdmin: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Inicio',
    icon: 'bi bi-house-door',
    class: '',
    extralink: false,
    submenu: []
  },
  
  {
    path: '/component/autos',
    title: 'Autos',
    icon: 'bi bi-car-front',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/empleados',
    title: 'Empleados',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/clientes',
    title: 'Cientes',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/alquileres',
    title: 'Alquileres',
    icon: 'bi bi-bookmark',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/devoluciones',
    title: 'Devoluciones',
    icon: 'bi bi-bookmark-check',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/reservas',
    title: 'Reservas',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/admin',
    title: 'Admin',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: []
  }
 
];
const RutasEmpleado: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Inicio',
    icon: 'bi bi-house-door',
    class: '',
    extralink: false,
    submenu: []
  },
  
  {
    path: '/component/autos',
    title: 'Autos',
    icon: 'bi bi-car-front',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/empleados',
    title: 'Empleados',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/clientes',
    title: 'Cientes',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/alquileres',
    title: 'Alquileres',
    icon: 'bi bi-bookmark',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/devoluciones',
    title: 'Devoluciones',
    icon: 'bi bi-bookmark-check',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/reservas',
    title: 'Reservas',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: []
  }
];

let ROUTES: RouteInfo[];

const tipousuario: string | null = localStorage.getItem('TipoUsuario');
console.log('se supone que imprime el tipo de usuario que es__',tipousuario);
if (tipousuario ==='empleado') {
  ROUTES = RutasEmpleado;
  console.log('se supone que callo en la condicion de empleado');

} else {
  ROUTES = RutasAdmin;
  console.log('se supone que callo en la condicion de admin');
}

export { ROUTES };
