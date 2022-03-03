import { Component, OnInit } from '@angular/core';
import { CharactersService } from 'src/app/service/characters.service';
import { DatabaseService } from 'src/app/service/database.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  input=""
  searchType= "1"
  characters = [];
  favourites = [];
  heroes: string[];
  quantity_favourites=0
  inicio = true

  constructor( private charactersService: CharactersService,private controlNav:NavController ,private router:Router, private toastController: ToastController, private alertController: AlertController,
  private database: DatabaseService, private platform: Platform){
    this.platform.ready().then(()=>{
      this.database.createDatabase()
    })
  }

  ngOnInit() {
    console.log("Se inicia")
    this.inicio = true
    this.getQuantityFavorites()
  }

  async information() {
    const toast = await this.toastController.create({
      header: 'Información',
      message: 'Busca tu personaje favorito ingresando su ID o Nombre.',
      position:'middle',
      buttons: [
        {
          side: 'start',
          icon: 'information',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Salir',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getFavorites(){
    this.database.getHeroes().then((data)=>{
      if (data.rows.length <= 0){
        this.toastMsg("No hay personajes marcados como favoritos");
      }else{
        this.inicio = false
        console.log("Data: " + data)
        for (var i = 0; i < data.rows.length; i++) {
          this.favourites.push(data.rows.item(i));
          console.log("Pushea: " + data.rows.item(i))
        }
        
      }
  })
  }

  getQuantityFavorites(){
    this.database.getHeroes().then((data)=>{
      this.quantity_favourites = data.rows.length
    })
  }

  home(){
    this.inicio = true
    this.characters = []
    this.favourites = [];
    this.controlNav.navigateForward('')
  }

  search(){
    this.characters = []
    if (this.searchType == "1"){
      this.charactersService.findById(this.input).subscribe ((response) => {
        if (response["error"]){
          this.toastController
          this.toastMsg('No hubo resultados');
        }else{
          this.characters.push(response)
        }
    },
      (err: HttpErrorResponse) => {
        console.log('Estado de error: ', err.status, typeof err.status);
        this.characters = []
      }
    )}    
    else{ 
      this.charactersService.findByName(this.input).subscribe ((response) => {
        if (response["error"]){
          this.toastController
          this.toastMsg('No hubo resultados');
        }else{
          this.characters = response["results"];
        }
    },
      (err: HttpErrorResponse) => {
        console.log('Estado de error: ', err.status, typeof err.status);
        this.characters = []
      }
    )}    
  }

  showCharacter(id){
    this.controlNav.navigateForward('/character/'+id)
  }

  async toastMsg(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position:'middle',
    });
    toast.present();
  }

}
