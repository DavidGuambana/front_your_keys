import { Component } from '@angular/core';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/modelo';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formmodelo',
  templateUrl: './formmodelo.component.html',
  styleUrls: ['./formmodelo.component.scss']
})
export class FormmodeloComponent {

  public modelo:Modelo = new Modelo()

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ModeloService: ModeloService,
   
  ){}

  ngOnInit(): void {
    this.cargarModelo()
   
     
  }


  cargarModelo(): void{
    this.activatedRoute.params.subscribe(params =>{
      let id= params['id']
      if(id){
        this.ModeloService.getModelo(id).subscribe((modelo)=>this.modelo=modelo)
      }
    })
  }

  public crearModelo():void{
    this.ModeloService.editar(this.modelo).subscribe(
    modelo => {
        this.router.navigate(['/component/admin'])
       
  Swal.fire('Modelo actualizada',`Modelo ${modelo.nombre} Guardado con exito`,'success')
    }
   
    )
  }
}
