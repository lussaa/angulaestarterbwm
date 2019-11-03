import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent} from "./header/header.component";


import { AppComponent } from './app.component';
import { RentalComponent } from './rental/rental.component';
import { RentalListComponent } from './rental/rental-list/rental-list.component';
import { RentalListItemComponent } from './rental/rental-list-item/rental-list-item.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RentalComponent,
    RentalListComponent,
    RentalListItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
