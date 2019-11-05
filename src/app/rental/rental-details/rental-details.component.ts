import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {logger} from "codelyzer/util/logger";

@Component({
  selector: 'bwm-rental-details',
  templateUrl: './rental-details.component.html',
  styleUrls: ['./rental-details.component.css']
})
export class RentalDetailsComponent implements OnInit {
  id: string;
  id$: Observable<string>;
  constructor(private routeParams: ActivatedRoute) { }

  ngOnInit() {
    this.routeParams.params.subscribe(
      (params) => {
        console.log("params are " + params.toString())
        this.id = params['rentalId'] }
    )
  }

}
