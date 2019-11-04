import { Component, OnInit } from '@angular/core';
import { apartments} from '../../../assets/apartments'


@Component({
  selector: 'bwm-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit {
  apartments = apartments;

  constructor() {

  }

  ngOnInit() {
  }

}
