import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HighschoolStats } from '../model/highSchoolStats';
import { CountyAbbreviation } from '../countyAbbreviation.enum';

@Injectable({ providedIn: 'root' })
export class baccalaureateService {
  http = inject(HttpClient);

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

  getStatsByCounty(countyAbbreviation: string): Observable<HighschoolStats[]> {
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

        const filtered = rows.filter(row =>
          row[idx.candidateCode]?.startsWith(countyAbbreviation)
        );

        const grouped: Record<string, {
          grades: number[];
          passed: number;
          profiles: Set<string>;
        }> = {};

        if (!this.fullDataStructure[countyAbbreviation]) {
          this.fullDataStructure[countyAbbreviation] = {};
        }

        if (!this.gradesOnProfile[countyAbbreviation]) {
          this.gradesOnProfile[countyAbbreviation] = {};
        }

        for (const row of filtered) {
          const schoolName = row[idx.school];
          const avg = parseFloat(row[idx.average]);
          const rom = parseFloat(row[idx.romanian]);
          const mandatory = parseFloat(row[idx.mandatory]);
          const optional = parseFloat(row[idx.optional]);
          const profile = row[idx.profile];
          const mandatorySubj = row[idx.mandatorySubject];
          const optionalSubj = row[idx.optionalSubject];

          if (!this.fullDataStructure[countyAbbreviation][schoolName]) {
            this.fullDataStructure[countyAbbreviation][schoolName] = {};
          }
          if (!this.fullDataStructure[countyAbbreviation][schoolName][profile]) {
            this.fullDataStructure[countyAbbreviation][schoolName][profile] = [];
          }
          this.fullDataStructure[countyAbbreviation][schoolName][profile].push(row);

          if (!this.gradesOnProfile[countyAbbreviation][schoolName]) {
            this.gradesOnProfile[countyAbbreviation][schoolName] = {};
          }
          if (!this.gradesOnProfile[countyAbbreviation][schoolName][profile]) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile] = {};
          }

          // Adăugare notă română
          if (!this.gradesOnProfile[countyAbbreviation][schoolName][profile]['Limba și literatura română']) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile]['Limba și literatura română'] = [];
          }
          if (!isNaN(rom)) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile]['Limba și literatura română'].push(rom);
          }

          // Adăugare notă disciplină obligatorie
          if (mandatorySubj && !this.gradesOnProfile[countyAbbreviation][schoolName][profile][mandatorySubj]) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile][mandatorySubj] = [];
          }
          if (!isNaN(mandatory)) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile][mandatorySubj]?.push(mandatory);
          }

          // Adăugare notă disciplină alegere
          if (optionalSubj && !this.gradesOnProfile[countyAbbreviation][schoolName][profile][optionalSubj]) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile][optionalSubj] = [];
          }
          if (!isNaN(optional)) {
            this.gradesOnProfile[countyAbbreviation][schoolName][profile][optionalSubj]?.push(optional);
          }

          if (!grouped[schoolName]) {
            grouped[schoolName] = { grades: [], passed: 0, profiles: new Set() };
          }

          if (!isNaN(avg)) {
            grouped[schoolName].grades.push(avg);
          }

          grouped[schoolName].profiles.add(profile);

          const validGrades = [rom, mandatory, optional];
          const isValid = validGrades.every(g => !isNaN(g));
          const isPass = avg >= 6 && validGrades.every(g => g >= 5);

          if (isValid && isPass) {
            grouped[schoolName].passed += 1;
          }
        }

        return Object.entries(grouped).map(([school, stats]) => {
          const total = stats.grades.length;
          const averageGrade = total ? stats.grades.reduce((a, b) => a + b, 0) / total : 0;
          const passingPercentage = total ? (stats.passed / total) * 100 : 0;

          return {
            highschool: school,
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            passingPercentage: parseFloat(passingPercentage.toFixed(2)),
            totalCandidates: total,
            profile: Array.from(stats.profiles),
          };
        });
      })
    );
  }

  getRawStructure() {
    return this.fullDataStructure;
  }

  getGradesOnProfileForHighschool(county: string, highschool: string, profile: string) {
    return this.gradesOnProfile[county]?.[highschool]?.[profile];
  }

  getAllGradesForHighschool(county: string, highschool: string) {
    return this.gradesOnProfile[county]?.[highschool]
  }

  getSubjectsForHighschool(county: string, highschool: string): string[] {
    const subjectsSet = new Set<string>();
    const schoolProfiles = this.gradesOnProfile[CountyAbbreviation[county as keyof typeof CountyAbbreviation]]?.[highschool];

    if (!schoolProfiles) return [];

    for (const profile of Object.keys(schoolProfiles)) {
      const subjects = schoolProfiles[profile];
      for (const subject of Object.keys(subjects)) {
        subjectsSet.add(subject);
      }
    }

    return Array.from(subjectsSet);
  }

  getSubjectDistributions(county: string, highschool: string): Record<string, number[]> {
  const subjectDistributions: Record<string, number[]> = {};

  const schoolProfiles = this.gradesOnProfile[county]?.[highschool];
  console.log(schoolProfiles)
  if (!schoolProfiles) return subjectDistributions;

  for (const profile of Object.keys(schoolProfiles)) {
    const subjects = schoolProfiles[profile];

    for (const subject of Object.keys(subjects)) {
      const grades = subjects[subject];
      if (!grades) continue;

      if (!subjectDistributions[subject]) {
        subjectDistributions[subject] = new Array(10).fill(0);
      }

      for (const grade of grades) {
        if (!isNaN(grade) && grade >= 0 && grade <= 10) {
          const bin = Math.min(9, Math.floor(grade));
          subjectDistributions[subject][bin]++;
        }
      }
    }
  }

  return subjectDistributions;
}

/*getGradesForSubjectOnProfile(
  countyCode: string,
  highschool: string,
  profile: string,
  subject: string
): string[] {
  const data = this.rawStructure?.[countyCode]?.[highschool]?.[profile];
  if (!data) return [];

  const grades: string[] = [];

  for (const row of data) {
    const rowSubject = row[13]; 
    const grade = row[14];      // sau alt index pentru nota

    if (rowSubject === subject && grade) {
      grades.push(grade);
    }
  }

  return grades;
}*/

}