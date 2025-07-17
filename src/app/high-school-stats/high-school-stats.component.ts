import { Component, inject } from '@angular/core';
import { CountySelectorComponent } from '../shared/components/county-selector/county-selector.component'
import { County } from '../shared/county.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighschoolStats } from '../shared/model/highSchoolStats';
import { HighSchoolCardComponent } from './high-school-card/high-school-card.component';
import { baccalaureateService } from '../shared/service/Baccalaureate.service';
import { CountyAbbreviation } from '../shared/countyAbbreviation.enum';

@Component({
  selector: 'app-high-school-stats',
  imports: [CountySelectorComponent, FormsModule, HighSchoolCardComponent],
  templateUrl: './high-school-stats.component.html',
  styleUrl: './high-school-stats.component.scss'
})
export class HighSchoolStatsComponent {
  selectedCounty: County | '' = '';

  router = inject(Router)
  route = inject(ActivatedRoute);
  highschoolService = inject(baccalaureateService);

  showFilterModal = false;
  showSortModal = false;


  filters = {
    profil: [] as string[],
    minMean: 0,
    minPromotionPercent: 0
  };
  availableProfiles = ['Matematică-Informatică', 'Științe ale Naturii', 'Uman', 'Tehnologic', 'Vocational'];

  sortCriteria = 'BAC'

  highschoolsArray: HighschoolStats[] = []

  showHighschoolsArray: HighschoolStats[] = [] //here will be highschools in right order respecting the filters


  ngOnInit(): void {
    const countyParam = this.route.snapshot.paramMap.get('county');
    if (countyParam && Object.values(County).includes(countyParam as County)) {
      this.selectedCounty = countyParam as County;
    }
    const abbreviation = CountyAbbreviation[countyParam as keyof typeof CountyAbbreviation];

    this.highschoolService.getStatsByCounty(abbreviation).subscribe((data) => {
      this.highschoolsArray = data;
      this.showHighschoolsArray = data;

      // aici datele sunt gata
      console.log(this.highschoolsArray);
    });
  }

  onCountySelected(county: string) {
    this.selectedCounty = county as County;
    this.router.navigate([this.router.url, county]);
  }

  applySort(sortType: string) {
    this.sortCriteria = sortType
  }

  applyFilters() {
    this.showFilterModal = false
  }

  showSort() {
    this.showSortModal = true;
  }

  showFilter() {
    this.showFilterModal = true;
  }

  resetFilters() {

  }
}
