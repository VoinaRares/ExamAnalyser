import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RawExaminee } from './raw-examinee.interface';
import { SpecializationGroup } from './specialization-group.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private bacData: any[] = [];

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

  // --- Funcționalități BAC ---

  loadBacData(): Observable<any[]> {
    if (this.bacData.length > 0) {
      return new Observable(observer => {
        observer.next(this.bacData);
        observer.complete();
      });
    }

    return this.http.get<any[][]>('assets/data/bac/2025.json').pipe(
      map(raw => {
        const headers = raw[0];
        const rows = raw.slice(1);
        this.bacData = rows.map(row => {
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = row[i];
          });
          return obj;
        });
        return this.bacData;
      })
    );
  }

  getBacLicee(): string[] {
    return Array.from(new Set(this.bacData.map(d => d['Unitatea de învăţământ'])));
  }

  getBacSpecializari(liceu?: string): string[] {
    return Array.from(
      new Set(
        this.bacData
          .filter(d => !liceu || d['Unitatea de învăţământ'] === liceu)
          .map(d => d['Specializare'])
      )
    );
  }

  getBacNoteDistribuite(liceu?: string, specializare?: string): Record<string, number> {
    const filtered = this.bacData.filter(
      d =>
        (!liceu || d['Unitatea de învăţământ'] === liceu) &&
        (!specializare || d['Specializare'] === specializare)
    );

    const distributie: Record<string, number> = {
      'Neprezentat': 0,
      'Respins': 0,
      '6–7': 0,
      '7–8': 0,
      '8–9': 0,
      '9–10': 0,
    };

    filtered.forEach(d => {
      const mediaStr = d['Media'];
      const nota = parseFloat(mediaStr);

      if (!mediaStr || isNaN(nota)) {
        distributie['Neprezentat']++;
      } else if (nota < 5) {
        distributie['Respins']++;
      } else if (nota < 7) {
        distributie['6–7']++;
      } else if (nota < 8) {
        distributie['7–8']++;
      } else if (nota < 9) {
        distributie['8–9']++;
      } else {
        distributie['9–10']++;
      }
    });

    return distributie;
  }
}
