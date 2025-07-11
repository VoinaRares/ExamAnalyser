import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getExamData(examType: string, year: string): Observable<any> {
    const url = `assets/data/${examType}/${year}.json`;
    return this.http.get<any>(url);
  }
}
