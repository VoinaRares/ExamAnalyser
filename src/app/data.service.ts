import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { RawExaminee } from './raw-examinee.interface';
import { SpecializationGroup } from './specialization-group.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private bacData: any[] = [];

  constructor(private http: HttpClient) {}

  getCounties(): Observable<{ label: string; value: string }[]> {
    return this.http
      .get<any[]>('assets/data/evaluare/counties.json')
      .pipe(
        map((counties) => counties.map((c) => ({ label: c.name, value: c.id })))
      );
  }

  getAvailableYears(county: string): Observable<number[]> {
    return this.http.get<number[]>(`assets/data/evaluare/${county}/years.json`);
  }

  getExamDataForYear(county: string, year: number): Observable<RawExaminee[]> {
    return this.http.get<RawExaminee[]>(`/assets/data/evaluare/${county}/${year}.json`);
  }

  getGroupedSchools(county: string, year: number): Observable<SpecializationGroup[]> {
    return this.getExamDataForYear(county, year).pipe(
      map((data) => {
        const rankedData = this.addCountyRanking(data);
        return this.groupBySpecialization(rankedData);
      })
    );
  }

  private addCountyRanking(data: RawExaminee[]): RawExaminee[] {
    const sorted = [...data].sort((a, b) => {
      const aGrade = parseFloat(a.madm.replace(',', '.'));
      const bGrade = parseFloat(b.madm.replace(',', '.'));
      return bGrade - aGrade;
    });

    return sorted.map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
    }));
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
          highestAdmissionGrade: grade,
          firstCandidate: entry,
          lastCandidate: entry,
        };
      } else {
        groups[key].candidates.push(entry);

        if (grade > groups[key].highestAdmissionGrade) {
          groups[key].highestAdmissionGrade = grade;
          groups[key].firstCandidate = entry;
        }

        if (grade < groups[key].lowestAdmissionGrade) {
          groups[key].lowestAdmissionGrade = grade;
          groups[key].lastCandidate = entry;
        }
      }
    }

    return Object.values(groups).map((group) => ({
      ...group,
      positionRange: this.calculatePositionRange(group),
    }));
  }

  private calculatePositionRange(group: SpecializationGroup): string {
    if (!group.candidates.length) return '';

    const ranks = group.candidates.map((c) => c.rank || 0);
    const minRank = Math.min(...ranks);
    const maxRank = Math.max(...ranks);

    return `${minRank} - ${maxRank}`;
  }

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
    const parts = cleaned.split(/\s*[\n\r]*<br\/?>\s*|\s*Limba\s+/i);
    return parts[0]?.trim() ?? '';
  }

  private extractLanguageFromSp(sp: string): string {
    const match = sp.split(/<br\/?>/i)[1];
    return match ? this.cleanHtml(match).trim() : '';
  }

  private cleanHtml(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, '').replace(/\s+/g, ' ');
  }

  loadBacData(): Observable<any[]> {
    if (this.bacData.length > 0) {
      return of(this.bacData);
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
      '9–10': 0
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
