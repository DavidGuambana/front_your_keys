import { Component, OnInit } from '@angular/core';
import { Auto } from 'src/app/models/auto';
import { AutoService } from 'src/app/services/auto.service';
import { Router ,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit{
  
  public auto:Auto=new Auto()
  imagenUrl: string | undefined;
  nuevaImagenFile: File | undefined;

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenUrl = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }
  constructor(private autoservice:AutoService, private router:Router,
    private activedRoute:ActivatedRoute){}
    ngOnInit(): void {
      this.cargarAuto()
        
    }
  cargarAuto():void{
    this.activedRoute.params.subscribe(params=>{
      let id=params['id']
      if(id){
       this.autoservice.buscar(id).subscribe((auto)=>this.auto=auto)
      } 
     })
  }
  public create():void{
    this.autoservice.crear(this.auto).
    subscribe(auto =>{
        this.router.navigate(['component/autos'])
      }
    )
  }

}
