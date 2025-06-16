import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, // Declare AppComponent so Angular knows about it
  ],
  imports: [
    BrowserModule, // BrowserModule provides services essential to launch and run a browser app
  ],
  providers: [], // Services would be listed here
  bootstrap: [AppComponent], // The main Angular component to bootstrap (start) the application
})
export class AppModule {}
