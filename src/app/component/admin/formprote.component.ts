import { Component } from '@angular/core';
import { Proteccion } from 'src/app/models/proteccion';
import { ProteccionService } from 'src/app/services/proteccion.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formprote',
  templateUrl: './formprote.component.html',
})
export class FormproteComponent {

  public proteccion:Proteccion = new Proteccion()
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ProteccionService: ProteccionService,
   
  ){}

  ngOnInit(): void {
    this.cargarProteccion()
  }


  cargarProteccion(): void{
    this.activatedRoute.params.subscribe(params =>{
      let id= params['id']
      if(id){
        this.ProteccionService.getProteccion(id).subscribe((proteccion)=>this.proteccion=proteccion)
      }
    })
  }

  public crearProteccion():void{
    this.ProteccionService.crear(this.proteccion).subscribe(
      proteccion => {
        this.router.navigate(['/component/admin'])
       
  Swal.fire('Proteccion actualizada',`Proteccion ${proteccion.nombre} Guardado con exito`,'success')
    }
   
    )
  }

}
