import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RawExaminee } from './raw-examinee.interface';
import { SpecializationGroup } from './specialization-group.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getAvailableYears(county: string): Observable<number[]> {
    return this.http.get<number[]>(
      `/assets/data/evaluare/${county}/years.json`
    );
  }

  getExamDataForYear(county: string, year: number): Observable<RawExaminee[]> {
    return this.http.get<RawExaminee[]>(
      `/assets/data/evaluare/${county}/${year}.json`
    );
  }

  getGroupedSchools(
    county: string,
    year: number
  ): Observable<SpecializationGroup[]> {
    return this.getExamDataForYear(county, year).pipe(
      map((data) => this.groupBySpecialization(data))
    );
  }

  private groupBySpecialization(data: RawExaminee[]): SpecializationGroup[] {
  const groups: { [key: string]: SpecializationGroup } = {};

  for (const entry of data) {
    const grade = parseFloat(entry.madm.replace(',', '.'));
    if (isNaN(grade)) continue;

    const highSchoolName = this.extractHighSchoolName(entry.h || '');
    const specializationCode = this.extractSpecializationCode(entry.sp || '');
    const specializationName = this.extractSpecializationName(entry.sp || '');
    const language = this.extractLanguageFromSp(entry.sp || '');

    if (!highSchoolName || !specializationCode) continue;

    const key = `${highSchoolName}|${specializationCode}`;

    if (!groups[key]) {
      groups[key] = {
        school: highSchoolName,
        code: specializationCode,
        county: entry.jp,
        specialization: specializationName,
        language: language,
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

// --- Helper Functions ---

private extractHighSchoolName(h: string): string {
  const match = h.match(/<b>(.*?)<\/b>/);
  return match ? match[1].trim() : '';
}

private extractSpecializationCode(sp: string): string {
  const match = sp.match(/\((\d+)\)/);
  return match ? match[1] : '';
}

private extractSpecializationName(sp: string): string {
  const cleaned = this.cleanHtml(sp);
  const parts = cleaned.split(/\s*[\n\r]*<br\/?>\s*|\s*Limba\s+/i); // fallback
  return parts[0]?.trim() ?? '';
}

private extractLanguageFromSp(sp: string): string {
  const match = sp.split(/<br\/?>/i)[1];
  return match ? this.cleanHtml(match).trim() : '';
}

private cleanHtml(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, '').replace(/\s+/g, ' ');
}


}
