import { Component } from '@angular/core';
import {CountySelectorComponent} from '../shared/components/county-selector/county-selector.component'
import { County } from '../shared/county.enum';

@Component({
  selector: 'app-high-school-stats',
  imports: [CountySelectorComponent],
  templateUrl: './high-school-stats.component.html',
  styleUrl: './high-school-stats.component.scss'
})
export class HighSchoolStatsComponent {
  selectedCounty: County | '' = '';

  onCountySelected(county: string)
  {
     this.selectedCounty = county as County;
  }
}
