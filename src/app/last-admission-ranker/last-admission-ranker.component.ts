import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { forkJoin, map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../shared/service/data.service';
import { ChartPoint } from './chart-point.interface';
import {
  flattenGroupsToChartPoints,
  toChartJSData,
  getFilterColor,
} from '../shared/service/last.admission-ranker.service';
import { HighschoolFilter } from '../shared/model/highschool-filter.interface';

@Component({
  standalone: true,
  selector: 'app-last-admission-ranker',
  imports: [CommonModule, FormsModule, ChartModule, ButtonModule],
  templateUrl: './last-admission-ranker.component.html',
  styleUrls: ['./last-admission-ranker.component.scss'],
})
export class LastAdmissionRankerComponent implements OnInit {
  points: ChartPoint[] = [];

  schoolOptions: { label: string; value: string }[] = [];
  specOptions: { label: string; value: string }[] = [];

  pendingSchool = '';
  pendingSpec = '';

  appliedFilters: HighschoolFilter[] = [];

  chartData: any = { datasets: [] };
  chartOptions: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const county = 'brasov'; // hardcoded for Brasov

    this.dataService.getAvailableYears(county).subscribe((availableYears) => {
      const years = availableYears.filter((y) => y >= 2010);

      const requests = years.map((year) =>
        this.dataService
          .getGroupedSchools(county, year)
          .pipe(map((data) => ({ year, data })))
      );

      forkJoin(requests).subscribe((yearlyGroups) => {
        this.points = flattenGroupsToChartPoints(yearlyGroups);

        this.schoolOptions = [...new Set(this.points.map((p) => p.school))].map(
          (s) => ({ label: s, value: s })
        );

        this.chartOptions = {
          responsive: true,
          plugins: {
            tooltip: { mode: 'index', intersect: false },
            legend: { position: 'bottom' },
          },
          scales: {
            x: {
              title: { display: true, text: 'An' },
              type: 'linear',
              ticks: { stepSize: 1, min: 2010, max: Math.max(...years) },
            },
            y: {
              title: { display: true, text: 'Media ultimului admis' },
              min: 5,
              max: 10,
            },
          },
          backgroundColor: '#ffffff',
        };

        this.updateChart();
      });
    });
  }

  onSchoolChange() {
    this.pendingSpec = '';
    if (!this.pendingSchool) {
      this.specOptions = [];
      return;
    }
    const specs = this.points
      .filter((p) => p.school === this.pendingSchool)
      .map((p) => p.specialization);
    this.specOptions = Array.from(new Set(specs))
      .sort((a, b) => a.localeCompare(b))
      .map((s) => ({ label: s, value: s }));
  }

  applyFilter() {
    if (!this.pendingSchool || !this.pendingSpec) return;

    const label = `${this.pendingSchool} | ${this.pendingSpec}`;
    // avoid duplicates
    if (!this.appliedFilters.some((f) => f.label === label)) {
      this.appliedFilters.push({
        school: this.pendingSchool,
        spec: this.pendingSpec,
        label,
      });
      this.updateChart();
    }
  }

  removeFilter(idx: number) {
    this.appliedFilters.splice(idx, 1);
    this.updateChart();
  }

  updateChart() {
    const allDatasets = this.appliedFilters.flatMap((f, idx) => {
      const chart = toChartJSData(this.points, {
        school: f.school,
        spec: f.spec,
      });

      const color = getFilterColor(idx);
      return chart.datasets.map((ds) => ({
        ...ds,
        label: f.label,
        borderColor: color,
        backgroundColor: color,
      }));
    });

    this.chartData = { datasets: allDatasets };
  }

  goBack() {
    window.history.back();
  }
}
