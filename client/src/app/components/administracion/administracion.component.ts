import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//Service 
import { AlumnoService } from '../../services/alumno.service';
//model 
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  public token;
  public alumnos: Alumno[]= [];
  public alumno: Alumno;
  public next_page;
  public prev_page;
  public total_items: number;//muestra el total de alumnos almacenados.
  public count_alumnos: number;//muestra el total de alumnos encontrados por paginado.
  public total_pages:number;
  public alumno_por_pagina = 4;//este limite esta configurado en el controlador alumno.controller
  public showModal:boolean = false;

  constructor(private _alumnoService: AlumnoService,
              private _route: ActivatedRoute) {

                this.next_page = 1;
                this.prev_page = 1;
               }

  ngOnInit() {
    this.alumno = new Alumno('','','','','');
    //cargamos localStorage
    this.token =  this._alumnoService.getToken();
   //Cargar Alumnos 
    this.cargar_datos();
  }

  cargar_datos(){
   
    this._route.params.forEach((params:Params)=>{
    
      let page = +params['page'];//concatena el numero de pagina a los parametros a enviar     

      if(!page){
        page = 1;
      }
      else{
        this.next_page = page+1;
        this.prev_page = page-1;

        if(this.prev_page == 0){
          this.prev_page = 1;
        }

        //se controla para que avanze solo hasta los ultimos registros.
        if(page == this.total_pages ){
          page = this.total_pages
          this.next_page = this.next_page-1  
        }
  }
     
    this._alumnoService.cargar_alumnos(page)
        .subscribe((res:any)=>{
          console.log('respuesta',res)
          this.alumnos = res.alumnos;
          this.total_items = res.total_alumnos;
          //sacamos el total de paginas dependiendo de la cantidad de registros 
          this.total_pages = Math.ceil(this.total_items / this.alumno_por_pagina)

        },
        (err)=>{
          console.log('Error en la Conuslta!.',err);
          //Materialize.toast('Error en la Consulta', 3000, 'red rounded')
        })
      });
   }

   open_modal(alumno, index){
      //muestra modal
      this.showModal = true;

      this.alumno.nombre = alumno.nombre;
      this.alumno.apellido = alumno.apellido;
      this.alumno._id = alumno._id;

      console.log(alumno);
      console.log(index);
   }

   closeModal(){
    this.showModal = false;
   }

   delete_alumno(alumn_id){
    this._alumnoService.delete_alumno(alumn_id, this.token)
    .subscribe((res:any)=>{
      console.log('Alumno Eliminado', res.alumno);
      this.closeModal();
      //Cargar Alumnos 
      this.cargar_datos();
    },
    (err)=>{
      console.log('Error en la Eliminacion', err);
    })
     
   }

}
