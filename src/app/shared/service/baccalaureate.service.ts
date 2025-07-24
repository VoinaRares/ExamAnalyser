import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HighschoolStats } from '../model/highSchoolStats';

@Injectable({ providedIn: 'root' })
export class baccalaureateService {
  http = inject(HttpClient);

  private dataInitialized = false;

  private fullDataStructure: {
    [county: string]: {
      [school: string]: {
        [profile: string]: any[][];
      };
    };
  } = {};

  private gradesOnProfile: {
    [county: string]: {
      [school: string]: {
        [profile: string]: {
          [subject: string]: number[];
        };
      };
    };
  } = {};

  private cachedStatsByCounty: {
    [county: string]: HighschoolStats[];
  } = {};

  getStatsByCounty(countyAbbreviation: string): Observable<HighschoolStats[]> {
    // Dacă datele au fost deja procesate, returnăm direct
    if (this.dataInitialized) {
      return of(this.cachedStatsByCounty[countyAbbreviation] || []);
    }

    const url = 'assets/data/bac/2025.json';

    return this.http.get<any[][]>(url).pipe(
      map((data) => {
        const [headers, ...rows] = data;
        const getIndex = (col: string) => headers.indexOf(col);

        const idx = {
          candidateCode: getIndex('Codul candidatului'),
          school: getIndex('Unitatea de învăţământ'),
          average: getIndex('Media'),
          romanian: getIndex('Romana Nota finală'),
          mandatory: getIndex('Nota finală disciplina obligatorie'),
          optional: getIndex('Nota finala alegere'),
          profile: getIndex('Specializare'),
          mandatorySubject: getIndex('Disciplina obligatorie'),
          optionalSubject: getIndex('Disciplina alegere'),
        };

        for (const row of rows) {
          const candidateCode = row[idx.candidateCode];
          const countyCode = candidateCode?.substring(0, 2);
          if (!countyCode) continue;

          const schoolName = row[idx.school];
          const profile = row[idx.profile];

          const avg = parseFloat(row[idx.average]);
          const rom = parseFloat(row[idx.romanian]);
          const mandatory = parseFloat(row[idx.mandatory]);
          const optional = parseFloat(row[idx.optional]);
          const mandatorySubj = row[idx.mandatorySubject];
          const optionalSubj = row[idx.optionalSubject];

          // === Full structure ===
          this.fullDataStructure[countyCode] ??= {};
          this.fullDataStructure[countyCode][schoolName] ??= {};
          this.fullDataStructure[countyCode][schoolName][profile] ??= [];
          this.fullDataStructure[countyCode][schoolName][profile].push(row);

          // === Grades on profile ===
          this.gradesOnProfile[countyCode] ??= {};
          this.gradesOnProfile[countyCode][schoolName] ??= {};
          this.gradesOnProfile[countyCode][schoolName][profile] ??= {};

          // Română
          const romKey = 'Limba și literatura română';
          this.gradesOnProfile[countyCode][schoolName][profile][romKey] ??= [];
          if (!isNaN(rom)) {
            this.gradesOnProfile[countyCode][schoolName][profile][romKey].push(rom);
          }

          // Mandatory subject
          if (mandatorySubj) {
            this.gradesOnProfile[countyCode][schoolName][profile][mandatorySubj] ??= [];
            if (!isNaN(mandatory)) {
              this.gradesOnProfile[countyCode][schoolName][profile][mandatorySubj].push(mandatory);
            }
          }

          // Optional subject
          if (optionalSubj) {
            this.gradesOnProfile[countyCode][schoolName][profile][optionalSubj] ??= [];
            if (!isNaN(optional)) {
              this.gradesOnProfile[countyCode][schoolName][profile][optionalSubj].push(optional);
            }
          }

          // === Cached stats ===
          const validGrades = [rom, mandatory, optional];
          const isValid = validGrades.every(g => !isNaN(g));
          const isPass = avg >= 6 && validGrades.every(g => g >= 5);

          const countyStats = this.cachedStatsByCounty[countyCode] ??= [];
          const schoolStats = countyStats.find(s => s.highschool === schoolName);

          if (schoolStats) {
            if (!isNaN(avg)) schoolStats.averageGrade += avg;
            if (isValid && isPass) schoolStats.passingPercentage += 1;
            schoolStats.totalCandidates += 1;
            schoolStats.profile.push(profile);
          } else {
            countyStats.push({
              highschool: schoolName,
              averageGrade: !isNaN(avg) ? avg : 0,
              passingPercentage: isValid && isPass ? 1 : 0,
              totalCandidates: 1,
              profile: [profile],
            });
          }
        }

        // Post-procesare: facem medii și procente
        for (const county in this.cachedStatsByCounty) {
          this.cachedStatsByCounty[county] = this.cachedStatsByCounty[county].map(stat => {
            const avg = stat.totalCandidates ? stat.averageGrade / stat.totalCandidates : 0;
            const pass = stat.totalCandidates ? (stat.passingPercentage / stat.totalCandidates) * 100 : 0;
            return {
              ...stat,
              averageGrade: parseFloat(avg.toFixed(2)),
              passingPercentage: parseFloat(pass.toFixed(2)),
              profile: Array.from(new Set(stat.profile)),
            };
          });
        }

        this.dataInitialized = true;
        return this.cachedStatsByCounty[countyAbbreviation] || [];
      })
    );
  }

  getRawStructure() {
    return this.fullDataStructure;
  }

  getGradesOnProfile() {
    return this.gradesOnProfile;
  }

  getGradesOnProfileForHighschool(county: string, highschool: string, profile: string) {
    return this.gradesOnProfile[county]?.[highschool]?.[profile];
  }
}
