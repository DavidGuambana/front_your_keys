import { Component, OnInit } from '@angular/core';
import { Auto } from 'src/app/models/auto';
import { AutoService } from 'src/app/services/auto.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'autos.component.html',
})
export class AutosComponent implements OnInit {
  autos:Auto[]=[];
 
  constructor(private autoService:AutoService, private router:Router){}
  ngOnInit() {this.autoService.listar().subscribe(
    autos=>this.autos=autos)}
}
