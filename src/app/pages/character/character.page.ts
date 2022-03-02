import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from 'src/app/service/characters.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatabaseService } from 'src/app/service/database.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-character',
  templateUrl: './character.page.html',
  styleUrls: ['./character.page.scss'],
})
export class CharacterPage implements OnInit {
  char={}
  character=[]
  favourites=[]
  id=""
  constructor(private charactersService: CharactersService, private toastController: ToastController, private router:Router, public database: DatabaseService,
    private activatedRoute: ActivatedRoute, private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data)=>{
      this.id=data.id
    })
    this.charactersService.findById(this.id).subscribe ((response) => {
      this.character.push(response)
      this.database.findFavorite(this.id).then((data)=>{
        if (data.rows.length > 0){
          document.getElementById("notFavorite").setAttribute("hidden","hidden")
          document.getElementById("favorite").removeAttribute("hidden")
        }
      }).catch((e)=>{
        console.log(JSON.stringify(e))
      })
    }, (err: HttpErrorResponse) => {
      console.log('Estado de error: ', err.status, typeof err.status);
      this.character[0] = []
      this.database.findFavorite(this.id).then((data) =>{
        if (data.rows.length > 0){
          let result=data.rows.item(0)
          this.char={
            image:{url:""},
            name:result.name,
            biography:{"full-name":result.full_name,
                       "place-of-birth":result.birth,
                       "publisher":result.publisher
                      },
            appearance:{"gender":result.gender,
                        "height":["0",result.height],
                        "weight":["0",result.weight],
                        "eye-color":result.eye_color,
                        "hair-color":result.hair_color,
                      },
            powerstats:{"intelligence":result.intelligence,
                        "strength":result.strength,
                        "speed":result.speed,
                        "durability":result.durability,
                        "power":result.power,
                        "combat":result.combat
                    },
            work:{"occupation":result.occupation}
          }
          this.toastMsg("Sin Conexión, datos recuperados por base.");
        }else{
          this.char={}
          this.toastMsg("Sin Conexión");
        }
      })
    }
  )}

  async information() {
    const toast = await this.toastController.create({
      header: 'Información',
      message: 'Navega por las caracteristicas del personaje, marcalo como favorito o compartilo!',
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

  return(){
    this.router.navigateByUrl('/')
  }

  favorite(){
    this.database.findFavorite(this.character[0]["id"]).then((data)=>{
      if (data.rows.length > 0){
        this.unmarkAsFavorite(this.character[0]["id"]);
        this.toastMsg("Superheroe removido de Mis Favoritos");
        document.getElementById("favorite").setAttribute("hidden","hidden")
        document.getElementById("notFavorite").removeAttribute("hidden")
      }else{
        this.markAsFavorite();
        this.toastMsg("Superheroe agregado a Mis Favoritos");
        document.getElementById("notFavorite").setAttribute("hidden","hidden")
        document.getElementById("favorite").removeAttribute("hidden")
      }
    })

  }

  markAsFavorite(){
    this.database.insertChar(this.character[0])
  }

  unmarkAsFavorite(id){
    this.database.deleteChar(id)
  }

  share(){
    let imageUrl= this.character[0]["image"]["url"]
    let text= "Mi personaje favortio es: " + this.character[0]["name"]
    this.socialSharing.share(text,"",imageUrl)
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
