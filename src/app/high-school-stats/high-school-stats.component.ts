import { Component } from '@angular/core';
import { COUNTIES } from '../shared/county';
@Component({
  selector: 'app-high-school-stats',
  imports: [],
  templateUrl: './high-school-stats.component.html',
  styleUrl: './high-school-stats.component.scss'
})
export class HighSchoolStatsComponent {
  selectedCounty='';
  counties=COUNTIES

  
}
