import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RawExaminee } from './raw-examinee.interface';
import { SpecializationGroup } from './specialization-group.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getAvailableYears(county: string): Observable<number[]> {
    return this.http.get<number[]>(`/assets/data/evaluare/${county}/years.json`);
  }

  getExamDataForYear(county: string, year: number): Observable<RawExaminee[]> {
    return this.http.get<RawExaminee[]>(`/assets/data/evaluare/${county}/${year}.json`);
  }

  getGroupedSchools(county: string, year: number): Observable<SpecializationGroup[]> {
    return this.getExamDataForYear(county, year).pipe(
      map(data => this.groupBySpecialization(data))
    );
  }

  private groupBySpecialization(data: RawExaminee[]): SpecializationGroup[] {
    const groups: { [key: string]: SpecializationGroup } = {};

    for (const entry of data) {
      const grade = parseFloat(entry.madm);
      if (isNaN(grade)) continue;

      const key = `${entry.sc}|${entry.sp}|${entry.lm}`;

      if (!groups[key]) {
        groups[key] = {
          school: entry.s,
          code: entry.sc,
          county: entry.jp,
          specialization: entry.sp,
          language: entry.lm,
          candidates: [entry],
          lowestAdmissionGrade: grade,
          highestAdmissionGrade: grade
        };
      } else {
        groups[key].candidates.push(entry);
        if (grade < groups[key].lowestAdmissionGrade) {
          groups[key].lowestAdmissionGrade = grade;
        }
        if (grade > groups[key].highestAdmissionGrade) {
          groups[key].highestAdmissionGrade = grade;
        }
      }
    }

    return Object.values(groups);
  }
}
