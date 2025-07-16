import { Component, inject } from '@angular/core';
import { CountySelectorComponent } from '../shared/components/county-selector/county-selector.component'
import { County } from '../shared/county.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-high-school-stats',
  imports: [CountySelectorComponent, FormsModule],
  templateUrl: './high-school-stats.component.html',
  styleUrl: './high-school-stats.component.scss'
})
export class HighSchoolStatsComponent {
  selectedCounty: County | '' = '';
  router = inject(Router)
  route = inject(ActivatedRoute);

  showFilterModal = false;
  showSortModal = false;


  filters = {
    profil: [] as string[],
    minMean: 0,
    minPromotionPercent: 0
  };
  availableProfiles = ['Matematică-Informatică', 'Științe ale Naturii', 'Uman', 'Tehnologic', 'Vocational'];

  sortCriteria='BAC'

  ngOnInit(): void {
    const countyParam = this.route.snapshot.paramMap.get('county');
    if (countyParam && Object.values(County).includes(countyParam as County)) {
      this.selectedCounty = countyParam as County;
    }
  }

  onCountySelected(county: string) {
    this.selectedCounty = county as County;
    this.router.navigate([this.router.url, county]);
  }

  applySort(sortType: string) {
    this.sortCriteria=sortType
  }

  applyFilters() {
    this.showFilterModal=false
  }

  showSort() {
    this.showSortModal = true;
  }

  showFilter() {
    this.showFilterModal = true;
  }

  resetFilters()
  {

  }
}
