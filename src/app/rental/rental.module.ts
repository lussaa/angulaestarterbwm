import { NgModule } from '@angular/core';
import {AppComponent} from "../app.component";
import {RentalComponent} from "./rental.component";
import {BrowserModule} from "@angular/platform-browser";
import {RentalListComponent} from "./rental-list/rental-list.component";
import {RentalListItemComponent} from "./rental-list-item/rental-list-item.component";


@NgModule({
  declarations: [
    RentalListComponent,
    RentalListItemComponent,
    RentalComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class RentalModule {}
