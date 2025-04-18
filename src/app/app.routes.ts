import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: ':fname/:lname/:job/:email/:phone', component: AppComponent }
]