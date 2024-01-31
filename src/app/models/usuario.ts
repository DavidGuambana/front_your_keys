import { UsuarioRol } from "./usuario_rol";

export class Usuario {

    id_usuario: number = 0;
    id_persona: number = 0;
    username: string = '';
    password: string = '';
    usuarios_roles: UsuarioRol []= [];
    usuario_rol:UsuarioRol = new UsuarioRol;

}
