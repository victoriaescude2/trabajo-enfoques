import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  database: SQLiteObject
  tables = {
        characters: "favorites_characters"
  }

  constructor(private sqlite: SQLite) {}

  async createDatabase(){
    await this.sqlite.create({
        name:"superheroes",
        location:"default"
    })
    .then((database: SQLiteObject)=>{
        this.database=database;
        console.log(database + "  esta es la database")
    })
    .catch((e)=>{
        alert("Error creando la BD " + JSON.stringify(e));
    });

    await this.createTables();
    
  }

  async createTables(){
    await this.database.executeSql(
    `CREATE TABLE IF NOT EXISTS ${this.tables.characters} ( id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    id_char VARCHAR(255) NULL UNIQUE, full_name VARCHAR(255) NULL, name VARCHAR(255) NULL, birth VARCHAR(255) NULL, gender VARCHAR(255) NULL,
    height VARCHAR(255) NULL, weight VARCHAR(255) NULL, eye_color VARCHAR(255) NULL, hair_color VARCHAR(255) NULL, 
    combat VARCHAR(255) NULL, durability VARCHAR(255) NULL, intelligence VARCHAR(255) NULL, power VARCHAR(255) NULL, 
    speed VARCHAR(255) NULL, strength VARCHAR(255) NULL, occupation VARCHAR(255) NULL, publisher VARCHAR(255) NULL, 
    url LONGTEXT NULL)`,
    []
    );
  }

  async insertChar(char){
    console.log(char)
    return this.database.executeSql(
        `INSERT INTO ${this.tables.characters} (id_char, full_name, name, birth, gender, 
          height, weight, eye_color, hair_color, combat, durability, intelligence, power, speed, strength, occupation,
          publisher, url) ` +
        `VALUES (${char.id}, '${char.biography["full-name"]}','${char.name}','${char.biography["place-of-birth"]}',
        '${char.appearance["gender"]}','${char.appearance["height"][1]}',` + 
        `'${char.appearance["weight"][1]}','${char.appearance["eye-color"]}','${char.appearance["hair-color"]}
        ','${char.powerstats["combat"]}','${char.powerstats["durability"]}',` + 
        `'${char.powerstats["intelligence"]}','${char.powerstats["power"]}','${char.powerstats["speed"]}
        ','${char.powerstats["strength"]}','${char.work["occupation"]}',` + 
        `'${char.biography["publisher"]}','${char.image["url"]}')`,
        []
    ).then(()=>{
        console.log("Personaje agregado a la tabla")
        return true
    })
    .catch((e)=>{
        return JSON.stringify(e)
    })
  }

  async deleteChar(id_char){
    return this.database
        .executeSql(`DELETE FROM ${this.tables.characters} WHERE id_char = ${id_char}`, [])
        .then(() => {
            return "Personaje eliminado";
        })
        .catch((e) => {
            return "Error eliminado personaje: " + JSON.stringify(e);
    });
  }

  async findFavorite(id_char){
    console.log(typeof(id_char))
    return this.database.executeSql(
        `SELECT * from ${this.tables.characters} where id_char = ${id_char}`,
        []
    ).then((response)=>{
      console.log(response)
      return response;
    })
    .catch((e)=>{
      console.log(JSON.stringify(e))
      return JSON.stringify(e)
    })
  }

  async getHeroes(){
    return this.database.executeSql(
        `SELECT * from ${this.tables.characters}`,
        []
    ).then((response)=>{
        return response;
    })
    .catch((e)=>{
        return JSON.stringify(e)
    })
  }

  async deleteDatabase(){
    this.sqlite.deleteDatabase({ name: "superheroes", location: 'default'})
    .then(()=>{
        return "Base de Datos Borrada"
    })
    .catch((e)=>{
        return "Falló"
    })
    
  }


}
