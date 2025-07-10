import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { HighschoolFormComponent } from './highschool-form/highschool-form.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'recomandare-liceu', component: HighschoolFormComponent }
];
