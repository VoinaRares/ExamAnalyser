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
    const distribution = this.dataService.getBacNoteDistribuite(this.selectedLiceu, this.selectedSpecializare);

    const labels = Object.keys(distribution);
    const data = Object.values(distribution).map((v) => Number(v));

    const backgroundColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#E7E9ED',
      '#76A346',
      '#A34676',
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
