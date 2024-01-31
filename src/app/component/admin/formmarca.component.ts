import { Component } from '@angular/core';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formmarca',
  templateUrl: './formmarca.component.html',
  styleUrls: ['./formmarca.component.scss']
})
export class FormmarcaComponent {
  public marca:Marca=new Marca();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private MarcaService: MarcaService,
  ){}

  ngOnInit(): void {
    this.cargarModelo()
   
     
  }


  cargarModelo(): void{
    this.activatedRoute.params.subscribe(params =>{
      let id= params['id']
      if(id){
        this.MarcaService.getMarca(id).subscribe((marca)=>this.marca=marca)
      }
    })
  }

  public crearMarca():void{
    this.MarcaService.editar(this.marca).subscribe(
    marca => {
        this.router.navigate(['/component/admin'])
       
  Swal.fire('Marca actualizada',`Marca ${marca.nombre} Guardado con exito`,'success')
    }
   
    )
  }

}
