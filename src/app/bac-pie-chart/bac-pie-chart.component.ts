import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

import { DataService } from '../data.service';

@Component({
  selector: 'app-bac-pie-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './bac-pie-chart.component.html',
  styleUrls: ['./bac-pie-chart.component.scss'],
})
export class BacPieChartComponent implements OnInit {
  licee: string[] = [];
  specializari: string[] = [];

  selectedLiceu?: string;
  selectedSpecializare?: string;

  pieChartType: ChartType = 'pie';

  pieChartOptions: ChartOptions = {
    responsive: true,
  };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  pieChartLegend = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.loadBacData().subscribe(() => {
      this.licee = this.dataService.getBacLicee();
      this.specializari = this.dataService.getBacSpecializari();
      this.updateChart();
    });
  }

  onLiceuChange() {
    if (this.selectedLiceu === '') {
      this.selectedLiceu = undefined;
    }
    this.specializari = this.dataService.getBacSpecializari(this.selectedLiceu);
    this.selectedSpecializare = undefined;
    this.updateChart();
  }

  onSpecializareChange() {
    if (this.selectedSpecializare === '') {
      this.selectedSpecializare = undefined;
    }
    this.updateChart();
  }

  updateChart() {
    const raw = this.dataService.getBacNoteDistribuite(this.selectedLiceu, this.selectedSpecializare);

    const buckets: Record<string, number> = {
      'Neprezentat': 0,
      'Respins (<6)': 0,
      '6 - 6.99': 0,
      '7 - 7.99': 0,
      '8 - 8.99': 0,
      '9 - 10': 0,
    };

    for (const [notaStr, count] of Object.entries(raw)) {
      const nota = parseFloat(notaStr.replace(',', '.'));
      if (isNaN(nota)) {
        buckets['Neprezentat'] += count;
      } else if (nota < 6) {
        buckets['Respins (<6)'] += count;
      } else if (nota < 7) {
        buckets['6 - 6.99'] += count;
      } else if (nota < 8) {
        buckets['7 - 7.99'] += count;
      } else if (nota < 9) {
        buckets['8 - 8.99'] += count;
      } else {
        buckets['9 - 10'] += count;
      }
    }

    const labels = Object.keys(buckets);
    const data = Object.values(buckets);

    const backgroundColors = [
      '#FF6384', '#FF9F40', '#FFCE56',
      '#4BC0C0', '#36A2EB', '#9966FF'
    ];

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
        },
      ],
    };
  }
}
