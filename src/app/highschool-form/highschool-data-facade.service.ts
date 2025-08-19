import { Injectable } from '@angular/core';
import { DataService } from '../shared/service/data.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HighschoolFacadeService {
  constructor(private dataService: DataService) {}

  getCounties() {
    return this.dataService.getCounties();
  }

  getAvailableYears(county: string) {
    return this.dataService.getAvailableYears(county);
  }

  loadFilteredSpecializationGroups(
    county: string,
    year: number,
    grade: number
  ) {
    return this.dataService
      .getGroupedSchools(county, year)
      .pipe(
        map((groups) =>
          groups
            .filter((group) => grade >= group.lowestAdmissionGrade)
            .sort((a, b) => b.lowestAdmissionGrade - a.lowestAdmissionGrade)
        )
      );
  }

  getGroupedSchools(county: string, year: number) {
    return this.dataService.getGroupedSchools(county, year);
  }

  initializeFormData(county: string, year: number, grade: number) {
    return this.getGroupedSchools(county, year).pipe(
      map((groups) =>
        groups
          .filter((g) => grade >= g.lowestAdmissionGrade)
          .sort((a, b) => b.lowestAdmissionGrade - a.lowestAdmissionGrade)
      )
    );
  }

  getOccupationRates(groups: any[], grade: number): Record<string, string> {
    const occupationRate: Record<string, string> = {};

    for (let highschool of groups) {
      const numberOfCandidates = highschool.candidates.length;

      const occupationNumber = highschool.candidates.filter(
        (item: { madm: any; sp: string; }) =>
          Number(item.madm) >= grade &&
          this.dataService.extractSpecializationName(item.sp) === highschool.specialization
      ).length;

      occupationRate[highschool.school + highschool.specialization] = (
        (occupationNumber / numberOfCandidates) *
        100
      ).toFixed(2);
    }

    return occupationRate;
  }
}
