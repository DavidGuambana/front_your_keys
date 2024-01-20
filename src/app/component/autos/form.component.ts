import { Component, OnInit } from '@angular/core';
import { Auto } from 'src/app/models/auto';
import { AutoService } from 'src/app/services/auto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Marca } from 'src/app/models/marca';
import { Modelo } from 'src/app/models/modelo';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public auto: Auto = new Auto();
  marcasList: Marca[] = [];
  modelosList:Modelo[]=[];
  imagenUrl: string | undefined;
  nuevaImagenFile: File | undefined;
  idmarca:number=0;

  constructor(
    private autoService: AutoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarAuto();
    this.cargarMarcas();
  }

  cargarAuto(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.autoService.buscar(id).subscribe(auto => this.auto = auto);
      }
    });
  }

  cargarMarcas(): void {
    this.marcaService.listar().subscribe(
      marcas => this.marcasList = marcas
    );
  }

  cargarModelos(idmarca:any): void {
    // Configurar idmarca con el valor deseado (por ejemplo, 4)
    //const filtro = this.idmarca; 
    // Obtener la lista de modelos
    this.modeloService.listar().subscribe(
      modelos => {
        // Asignar la lista completa de modelos a modelosList
        this.modelosList = modelos;
        console.log('Modelos List sin filtrado:', this.modelosList);
  
        // Filtrar la lista de modelos para incluir solo aquellos con id_marca igual a this.idmarca
        console.log('aqui id marca 1:', idmarca);
        this.modelosList = this.modelosList.filter(modelo => modelo.id_marca === idmarca);
  
        // Imprimir en la consola
        console.log('filtor:', idmarca);
        console.log('Modelos List se supone filtrado:', this.modelosList);
      }
    );
  }

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
  create(): void {
    this.autoService.crear(this.auto).subscribe(() => {
      this.router.navigate(['component/autos']);
    });
  }
}   
