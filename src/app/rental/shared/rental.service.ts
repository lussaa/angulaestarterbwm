import { Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {RentalModel} from "./rental-model";

export class RentalService {



  public getRentals(): any {
    const observable = new Observable((observer) =>{ //arrow funct is binding outer context to 'this' context
      setTimeout(() => {
        observer.next(this.rentals)
      }, 1000 );
      setTimeout(() => {
        observer.next("ErroOor")
      }, 2000 );
      setTimeout(() => {
        observer.next("")
      }, 3000 );
    });
    return observable;
  }


  private rentals: RentalModel[] = [
    {
      name: "Los Angeles comfy room",
      price: 25.99,
      id: 1,
      city: "LA",
      street: "newyorker",
      category:"condo",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 3,
      description: "Very nice studio",
      dailyRate: 34,
      shared: false,
      createdAt: "24/12/2017"
    },
    {
      name: "Oslo awesome room",
      price: 29.99,
      id: 2,
      city: "Oslo",
      street: "condoOslan 42",
      category:"studio",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 2,
      description: "Very nice studio in oslo",
      dailyRate: 14,
      shared: false,
      createdAt: "22/12/2017"
    },
    {
      name: "Hawaii aloha apartment",
      price: 21.99,
      id: 3,
      city: "Hawaii",
      street: "streeeet",
      category:"studio",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 1,
      description: "Very nice studio",
      dailyRate: 24,
      shared: true,
      createdAt: "24/12/2018"
    },
    {
      name: "Vis chocolate trees apartment",
      price: 21.99,
      id: 3,
      city: "Vis",
      street: "Ulica Javora",
      category:"studio",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 4,
      description: "Very nice studio",
      dailyRate: 15,
      shared: true,
      createdAt: "24/12/2018"
    }
  ]


}
