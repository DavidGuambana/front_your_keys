import { Component } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forcate',
  templateUrl: './forcate.component.html',
  styleUrls: ['./forcate.component.scss']
})
export class ForcateComponent {
  public categoria: Categoria = new Categoria;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private CategoriaService: CategoriaService,
  ) { }
  ngOnInit(): void {
    this.cargarCategoria()


  }


  public crearCategorias(): void {
    this.CategoriaService.editar(this.categoria).subscribe(
      categoria => {
        this.router.navigate(['/component/admin']);
  
        Swal.fire('Categoria actualizado', `Categoria ${categoria.nombre} Guardado con exito`, 'success');
  
        // Cargar la categoría después de crearla
        this.cargarCategoria();
      }
    );
  }
  
  cargarCategoria(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.CategoriaService.getCategoria(id).subscribe((categoria) => this.categoria = categoria);
      }
    });
  }

 

  


}
