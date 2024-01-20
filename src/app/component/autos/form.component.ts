import { Component, OnInit } from '@angular/core';
import { Auto } from 'src/app/models/auto';
import { AutoService } from 'src/app/services/auto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Marca } from 'src/app/models/marca';
import { Modelo } from 'src/app/models/modelo';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public auto: Auto = new Auto();
  marcasList: Marca[] = [];
  modelosList:Modelo[]=[];
  categoriaList:Categoria[]=[];
  imagenUrl: string | undefined;
  nuevaImagenFile: File | undefined;
  id_marca:any;

  constructor(
    private autoService: AutoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private categoriaService:CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarAuto();
    this.cargarMarcas();
    this.cargarModeloss();
    this.cargarCategorias();
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
  cargarModeloss(): void {
    this.modeloService.listar().subscribe(
      modelos => this.modelosList = modelos
    );
  }
  cargarCategorias() {
    this.categoriaService.listar().subscribe(
      categorias => this.categoriaList = categorias
    );
  }
  



  cargarModelos(): void {
    console.log('Marca seleccionada:', this.id_marca);
    this.modeloService.listar().subscribe(
      modelos => {
        this.modelosList = modelos;
        this.modelosList = this.modelosList.filter(modelo => modelo.id_marca === this.id_marca);
        console.log('Modelos filtrados:', this.modelosList);
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
    this.auto.id_estado=1;
    this.autoService.crear(this.auto).subscribe(() => {
      this.router.navigate(['component/autos']);
    });
  }
}   
