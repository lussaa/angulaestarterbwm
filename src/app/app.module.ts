import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent} from "./header/header.component";
import { RentalModule } from "./rental/rental.module";

import { AppComponent } from './app.component';
import { RentalComponent } from './rental/rental.component';
import {RouterModule, Routes} from "@angular/router";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RentalModule,
    RouterModule.forRoot([
      { path: '', redirectTo: "/rentals", pathMatch:"full" }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
