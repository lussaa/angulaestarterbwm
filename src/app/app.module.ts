import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent} from "./header/header.component";
import { RentalModule } from "./rental/rental.module";

import { AppComponent } from './app.component';
import { RentalComponent } from './rental/rental.component';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { TovItemComponent } from './tov-item/tov-item.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TovItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RentalModule,
    RouterModule.forRoot([
      { path: '', redirectTo: "/rentals", pathMatch:"full" }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
