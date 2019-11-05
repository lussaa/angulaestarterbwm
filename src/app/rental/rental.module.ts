import { NgModule } from '@angular/core';
import {AppComponent} from "../app.component";
import {RentalComponent} from "./rental.component";
import {BrowserModule} from "@angular/platform-browser";
import {RentalListComponent} from "./rental-list/rental-list.component";
import {RentalListItemComponent} from "./rental-list-item/rental-list-item.component";
import {CommonModule} from "@angular/common";
import {RentalService} from "./shared/rental.service"; // service is a PROVIDE
import {RouterModule, Routes} from "@angular/router";
import { RentalDetailsComponent } from './rental-details/rental-details.component';

const routes: Routes = [
  { path: 'rentals',
    component:RentalComponent,
    children: [
      { path: '', component: RentalListComponent},
      { path: ':rentalId', component: RentalDetailsComponent}
    ]}
]
@NgModule({
  declarations: [
    RentalListComponent,
    RentalListItemComponent,
    RentalComponent,
    RentalDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [RentalService]
})

export class RentalModule {}
