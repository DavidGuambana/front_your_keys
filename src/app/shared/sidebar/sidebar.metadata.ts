// Sidebar route metadata
export interface RouteInfo {
  rol: string;
  path: string;
  title: string;
  icon: string;
  class: string;
  extralink: boolean;
  submenu: RouteInfo[];
}
