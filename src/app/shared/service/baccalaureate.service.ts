import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HighschoolStats } from '../model/highSchoolStats';

@Injectable({ providedIn: 'root' })
export class baccalaureateService {
    http = inject(HttpClient)


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
                };

                const filtered = rows.filter(row =>
                    row[idx.candidateCode]?.startsWith(countyAbbreviation)
                );

                const grouped: Record<string, { grades: number[]; passed: number; profile: string }> = {};

                for (const row of filtered) {
                    const schoolName = row[idx.school];
                    const avg = parseFloat(row[idx.average]);
                    const rom = parseFloat(row[idx.romanian]);
                    const mandatory = parseFloat(row[idx.mandatory]);
                    const optional = parseFloat(row[idx.optional]);

                    if (!grouped[schoolName]) {
                        grouped[schoolName] = { grades: [], passed: 0, profile: row[idx.profile] };
                    }


                    if (!isNaN(avg)) {
                        grouped[schoolName].grades.push(avg);
                    }

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
                        profile: stats.profile
                    };
                });

            })
        );
    }
}