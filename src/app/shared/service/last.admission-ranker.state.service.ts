
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataService } from './data.service';
import { HighschoolFilter } from '../model/highschool-filter.interface';
import { ChartPoint } from '../model/chart-point.interface';
import { flattenGroupsToChartPoints, toChartJSData, getFilterColor } from '../../last-admission-ranker/last-admission-chart.utils';
import { of } from 'rxjs';

@Injectable()
export class RankerStateService {
  private countyDataCache: Record<string, ChartPoint[]> = {};
  private appliedFiltersSubject = new BehaviorSubject<HighschoolFilter[]>([]);
  private chartDataSubject = new BehaviorSubject<any>({ datasets: [] });

  appliedFilters$ = this.appliedFiltersSubject.asObservable();
  chartData$ = this.chartDataSubject.asObservable();

  constructor(private dataService: DataService) {}

  loadCountyData(county: string): Observable<ChartPoint[]> {
    if (this.countyDataCache[county]) {
      return of(this.countyDataCache[county]);
    }

    return this.dataService.getAvailableYears(county).pipe(
      map(years => years.filter(y => y >= 2010)),
      switchMap(years => {
        const requests = years.map(year =>
          this.dataService.getGroupedSchools(county, year).pipe(
            map(data => ({ year, county, data }))
        ));
        return forkJoin(requests);
      }),
      map(groups => {
        const points = flattenGroupsToChartPoints(groups);
        this.countyDataCache[county] = points;
        return points;
      })
    );
  }

  getSchoolOptions(county: string): Observable<{label: string, value: string}[]> {
    return this.loadCountyData(county).pipe(
      map(points => {
        const schools = [...new Set(points.map(p => p.school))];
        return schools
          .map(s => ({ label: s, value: s }))
          .sort((a, b) => a.label.localeCompare(b.label));
      })
    );
  }

  getSpecOptions(county: string, school: string): Observable<{label: string, value: string}[]> {
    return this.loadCountyData(county).pipe(
      map(points => {
        const specs = points
          .filter(p => p.school === school)
          .map(p => p.specialization);
        return [...new Set(specs)]
          .sort((a, b) => a.localeCompare(b))
          .map(s => ({ label: s, value: s }));
      })
    );
  }

  applyFilter(filter: HighschoolFilter): void {
    const currentFilters = this.appliedFiltersSubject.value;
    if (!currentFilters.some(f => f.label === filter.label)) {
      this.appliedFiltersSubject.next([...currentFilters, filter]);
      this.updateChart();
    }
  }

  removeFilter(index: number): void {
    const currentFilters = [...this.appliedFiltersSubject.value];
    currentFilters.splice(index, 1);
    this.appliedFiltersSubject.next(currentFilters);
    this.updateChart();
  }

  resetFilters(): void {
    this.appliedFiltersSubject.next([]);
    this.updateChart();
  }

  private updateChart(): void {
    const filters = this.appliedFiltersSubject.value;
    const datasets = filters.flatMap((filter, idx) => {
      const points = this.countyDataCache[filter.county] || [];
      const chart = toChartJSData(points, { school: filter.school, spec: filter.spec });
      const color = getFilterColor(idx);

      return chart.datasets.map(ds => ({
        ...ds,
        label: filter.label,
        borderColor: color,
        backgroundColor: color
      }));
    });

    this.chartDataSubject.next({ datasets });
  }
}
