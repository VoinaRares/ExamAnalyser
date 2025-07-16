import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { HighschoolFormComponent } from './highschool-form/highschool-form.component';
import { HighSchoolStatsComponent } from './high-school-stats/high-school-stats.component'

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'recomandare-liceu', component: HighschoolFormComponent },
  { path: 'statistici-licee', component: HighSchoolStatsComponent },
  {  path: 'statistici-licee/:county', component: HighSchoolStatsComponent }
];
