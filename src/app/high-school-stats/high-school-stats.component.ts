import { Component, inject } from '@angular/core';
import { CountySelectorComponent } from '../shared/components/county-selector/county-selector.component'
import { County } from '../shared/county.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighschoolStats } from '../shared/model/highSchoolStats';
import { HighSchoolCardComponent } from './high-school-card/high-school-card.component';
import { baccalaureateService } from '../shared/service/baccalaureate.service';
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

      const allProfiles = data.flatMap(hs => hs.profile);
      this.availableProfiles = [...new Set(allProfiles)].sort();
    });
  }

  onCountySelected(county: string) {
    this.selectedCounty = county as County;
    this.router.navigate([this.router.url, county]);
  }

  applySort(sortType: string) {
    this.sortCriteria = sortType
  }


  
  ///filters area
  onProfileCheckboxChange(event: Event, profile: string) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.filters.profil.includes(profile)) {
        this.filters.profil.push(profile);
      }
    } else {
      this.filters.profil = this.filters.profil.filter(p => p !== profile);
    }
  }


  applyFilters() {
    this.showHighschoolsArray = this.highschoolsArray.filter(hs => {
      if (hs.averageGrade < this.filters.minMean) {
        return false;
      }

      if (hs.passingPercentage < this.filters.minPromotionPercent) {
        return false;
      }

      if (this.filters.profil.length > 0) {
        const matchesProfile = hs.profile.some(p => this.filters.profil.includes(p));
        if (!matchesProfile) {
          return false;
        }
      }
      return true;
    });

    this.showFilterModal = false;
  }

  showSort() {
    this.showSortModal = true;
  }

  showFilter() {
    this.showFilterModal = true;
  }

  resetFilters() {
    this.filters = {
      profil: [] as string[],
      minMean: 0,
      minPromotionPercent: 0
    };
    this.showHighschoolsArray = this.highschoolsArray
    this.showFilterModal = false
  }
}
