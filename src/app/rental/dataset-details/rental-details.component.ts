import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {logger} from "codelyzer/util/logger";
import {RentalModel} from "../shared/rental-model";
import {RentalService} from "../shared/rental.service";
import {RentalService2} from "../shared/rental.service2";

@Component({
  selector: 'bwm-rental-details',
  templateUrl: './rental-details.component.html',
  styleUrls: ['./rental-details.component.css']
})
export class RentalDetailsComponent implements OnInit {
  rental: RentalModel;
  id: string;
  idNum: number;
  constructor(private routeParams: ActivatedRoute, private rentalService: RentalService, private  rentalService2: RentalService2) { }

  ngOnInit() {
    this.routeParams.params.subscribe(
      (params) => {
        this.id = params['rentalId'] }
    )
    this.getRental(this.id);
  }
  getRental(rentalId: string){

    this.idNum = parseInt(rentalId);
    this.rentalService.getRentalById(this.idNum).subscribe(
      (rental: RentalModel) => {
        this.rental = rental;
      },
      (err)=> {},
      () =>  {}
    );

  }


  showApiData() {
    this.rentalService2.getConfig()
      .subscribe((data: TovItem) => this.config = {
        heroesUrl: data['heroesUrl'],
        textfile:  data['textfile']
      });
  }

}
