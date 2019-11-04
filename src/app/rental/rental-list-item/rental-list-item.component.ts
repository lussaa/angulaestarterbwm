import {Component, Input, OnInit} from '@angular/core';
import { apartments} from '../../../assets/apartments'

@Component({
  selector: 'bwm-rental-list-item',
  templateUrl: './rental-list-item.component.html',
  styleUrls: ['./rental-list-item.component.css']
})
export class RentalListItemComponent implements OnInit {
  @Input() apartment: any;
  constructor() { }

  ngOnInit() {
  }

}
