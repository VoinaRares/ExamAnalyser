import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { HighschoolFormComponent } from './highschool-form/highschool-form.component';
import { HighSchoolStatsComponent } from './high-school-stats/high-school-stats.component'
import {HighSchoolRecommendationComponent} from './high-school-recommendation/high-school-recommendation.component';
import { BacPieChartComponent } from './bac-pie-chart/bac-pie-chart.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'recomandare-liceu', component: HighschoolFormComponent },
  { path: 'statistici-licee', component: HighSchoolStatsComponent },
  {  path: 'statistici-licee/:county', component: HighSchoolStatsComponent },
  {path: 'recomandare-inteligenta', component:HighSchoolRecommendationComponent},
  { path: 'bac-chart', component: BacPieChartComponent }
];
