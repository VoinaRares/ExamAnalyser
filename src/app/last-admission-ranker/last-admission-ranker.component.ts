import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { HighschoolFilter } from '../shared/model/highschool-filter.interface';
import { RankerStateService } from '../shared/service/last.admission-ranker.state.service';
import { DataService } from '../shared/service/data.service';

@Component({
  standalone: true,
  selector: 'app-last-admission-ranker',
  imports: [CommonModule, FormsModule, ChartModule, ButtonModule],
  templateUrl: './last-admission-ranker.component.html',
  styleUrls: ['./last-admission-ranker.component.scss'],
  providers: [RankerStateService]
})
export class LastAdmissionRankerComponent implements OnInit {
  counties: { label: string; value: string }[] = [];
  chartData$: Observable<any>;
  appliedFilters$: Observable<HighschoolFilter[]>;

  pendingCounty = '';
  pendingSchool = '';
  pendingSpec = '';
  schoolOptions: { label: string; value: string }[] = [];
  specOptions: { label: string; value: string }[] = [];

  readonly chartOptions = {
    responsive: true,
    plugins: {
      tooltip: { mode: 'index', intersect: false },
      legend: { position: 'bottom' }
    },
    scales: {
      x: {
        title: { display: true, text: 'An' },
        type: 'linear',
        ticks: { stepSize: 1, min: 2010, max: 2024 }
      },
      y: {
        title: { display: true, text: 'Media ultimului admis' },
        min: 5,
        max: 10
      }
    }
  };

  constructor(
    private state: RankerStateService,
    private dataService: DataService
  ) {
    this.chartData$ = this.state.chartData$;
    this.appliedFilters$ = this.state.appliedFilters$;
  }

  ngOnInit(): void {
    this.dataService.getCounties().subscribe(counties => {
      this.counties = counties;
    });
  }

  onPendingCountyChange(): void {
    this.resetSchoolSelections();
    if (!this.pendingCounty) return;

    this.state.getSchoolOptions(this.pendingCounty).subscribe(options => {
      this.schoolOptions = options;
    });
  }

  onSchoolChange(): void {
    this.resetSpecSelections();
    if (!this.pendingCounty || !this.pendingSchool) return;

    this.state.getSpecOptions(this.pendingCounty, this.pendingSchool).subscribe(options => {
      this.specOptions = options;
    });
  }

  applyFilter(): void {
    if (!this.pendingCounty || !this.pendingSchool || !this.pendingSpec) return;

    const filter: HighschoolFilter = {
      county: this.pendingCounty,
      school: this.pendingSchool,
      spec: this.pendingSpec,
      label: `${this.pendingCounty} | ${this.pendingSchool} | ${this.pendingSpec}`
    };

    this.state.applyFilter(filter);
  }

  removeFilter(index: number): void {
    this.state.removeFilter(index);
  }

  resetChart(): void {
    this.pendingCounty = '';
    this.resetSchoolSelections();
    this.state.resetFilters();
  }

  goBack(): void {
    window.history.back();
  }

  private resetSchoolSelections(): void {
    this.pendingSchool = '';
    this.pendingSpec = '';
    this.schoolOptions = [];
    this.resetSpecSelections();
  }

  private resetSpecSelections(): void {
    this.pendingSpec = '';
    this.specOptions = [];
  }
}
