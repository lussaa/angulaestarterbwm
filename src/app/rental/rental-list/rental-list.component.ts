import { Component, OnInit } from '@angular/core';
//import { apartments} from '../../../assets/apartments'
import {RentalService} from "../shared/rental.service";
import { RentalModel} from "../shared/rental-model";

@Component({
  selector: 'bwm-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit {
  //apartments = apartments;
  apartments;
  rentals: RentalModel[] = [];
  constructor(private rentalService : RentalService) {

  }

  ngOnInit() {
    const rentalObservale = this.rentalService.getRentals();
    rentalObservale.subscribe(
      (rentals: RentalModel[]) => {
        this.apartments = rentals;
      },
      (err)=> {},
      () =>  {}
    );
  }

}
