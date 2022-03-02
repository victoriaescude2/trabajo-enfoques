import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(private http: HttpClient, private router: Router) {}

  findById(id){
    return this.http.get<Object>(
      `https://www.superheroapi.com/api.php/10226363248884169/${id}`
    )
  }

  findByName(nombre){
    return this.http.get<Object>(
      `https://www.superheroapi.com/api.php/10226363248884169/search/${nombre}`
    )

  }
}
