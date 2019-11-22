import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RentalService2 {
  constructor(private http: HttpClient) { }

  url = '../../assets/apartments.ts';


  getConfig() {
    return this.http.get<TovItem>(this.url);
  }


}
