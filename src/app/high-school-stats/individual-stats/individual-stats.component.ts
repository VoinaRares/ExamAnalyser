import { Component, output, input, inject } from '@angular/core';
import { HighschoolStats } from '../../shared/model/highSchoolStats';
import { FormsModule } from '@angular/forms';
import { baccalaureateService } from '../../shared/service/baccalaureate.service';
import { CountyAbbreviation } from '../../shared/countyAbbreviation.enum';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-individual-stats',
  imports: [FormsModule, NgChartsModule],
  templateUrl: './individual-stats.component.html',
  styleUrl: './individual-stats.component.scss'
})
export class IndividualStatsComponent {

  highschool = input<HighschoolStats>()
  county = input<string>();

  closeModal = output();
  bacService = inject(baccalaureateService)

  selectedProfile: string = '';
  mean: number | undefined = 0
  profileMean = 9;

  pieChartType: ChartType = 'pie';

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };


  generalPieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  profilePieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  barChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: '#4BC0C0', label: 'Distribuție note' }]
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {

          display: true,
          text: 'Intervale de notă'
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Număr de elevi'
        }
      }
    }
  };

  selectedSubject = '';
  subjects: string[] = [];



  ngOnInit() {
    this.mean = this.highschool()?.averageGrade
    this.updateGeneralChart();

    this.subjects = this.bacService.getSubjectsForHighschool(this.county()!, this.highschool()!.highschool)
  }

  close() {
    this.closeModal.emit();
  }

  onProfileChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedProfile = selectElement.value;
    this.selectedProfile = selectedProfile;
    const countyCode = CountyAbbreviation[this.county()! as keyof typeof CountyAbbreviation]

    //in profileData e dictionar cu chei numele materiei si valoare un array de note
    //const profileData = this.bacService.getGradesOnProfileForHighschool(countyCode, this.highschool()!.highschool, selectedProfile)
    const rawData = this.bacService.getRawStructure();

    const profileRows = rawData[countyCode][this.highschool()!.highschool]?.[selectedProfile];
    console.log(profileRows)

    if (!profileRows) {
      this.profileMean = 0;
      return;
    }

    let mediaSum = 0;
    let count = 0;

    for (const row of profileRows) {
      const media = parseFloat(row[19]); // "Media" e pe coloana 19
      if (!isNaN(media)) {
        mediaSum += media;
        count++;
      }
    }

    this.profileMean = count ? parseFloat((mediaSum / count).toFixed(2)) : 0;
    this.updateProfileChart(profileRows);
  }

  updateGeneralChart() {
    const countyCode = CountyAbbreviation[this.county()! as keyof typeof CountyAbbreviation];
    const rawData = this.bacService.getRawStructure();
    const schoolData = rawData[countyCode]?.[this.highschool()!.highschool];

    const buckets: Record<string, number> = {
      'Neprezentat': 0,
      'Respins (<6)': 0,
      '6 - 6.99': 0,
      '7 - 7.99': 0,
      '8 - 8.99': 0,
      '9 - 10': 0
    };

    if (!schoolData) {
      this.generalPieChartData = {
        labels: Object.keys(buckets),
        datasets: [{ data: Object.values(buckets), backgroundColor: [] }]
      };
      return;
    }

    for (const profile of Object.keys(schoolData)) {
      for (const row of schoolData[profile]) {
        const media = parseFloat(row[19]); // Media e la coloana 19
        if (isNaN(media)) {
          buckets['Neprezentat']++;
        } else if (media < 6) {
          buckets['Respins (<6)']++;
        } else if (media < 7) {
          buckets['6 - 6.99']++;
        } else if (media < 8) {
          buckets['7 - 7.99']++;
        } else if (media < 9) {
          buckets['8 - 8.99']++;
        } else {
          buckets['9 - 10']++;
        }
      }
    }

    const labels = Object.keys(buckets);
    const values = Object.values(buckets);
    const colors = ['#FF6384', '#FF9F40', '#FFCE56', '#4BC0C0', '#36A2EB', '#9966FF'];

    this.generalPieChartData = {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length)
      }]
    };
  }

  updateProfileChart(profileRows: any[]) {
    const buckets: Record<string, number> = {
      'Neprezentat': 0,
      'Respins (<6)': 0,
      '6 - 6.99': 0,
      '7 - 7.99': 0,
      '8 - 8.99': 0,
      '9 - 10': 0
    };

    for (const row of profileRows) {
      const media = parseFloat(row[19]);
      if (isNaN(media)) buckets['Neprezentat']++;
      else if (media < 6) buckets['Respins (<6)']++;
      else if (media < 7) buckets['6 - 6.99']++;
      else if (media < 8) buckets['7 - 7.99']++;
      else if (media < 9) buckets['8 - 8.99']++;
      else buckets['9 - 10']++;
    }

    const labels = Object.keys(buckets);
    const data = Object.values(buckets);
    const backgroundColor = ['#FF6384', '#FF9F40', '#FFCE56', '#4BC0C0', '#36A2EB', '#9966FF'];

    this.profilePieChartData = {
      labels,
      datasets: [{ data, backgroundColor }]
    };
  }

  onSubjectSelect(subject: string) {
    this.selectedSubject = subject;

    const countyCode = CountyAbbreviation[this.county()! as keyof typeof CountyAbbreviation];
    const schoolName = this.highschool()!.highschool;

    const subjectDistributions = this.bacService.getSubjectDistributions(countyCode, schoolName);

    const bins = subjectDistributions[subject] ?? new Array(10).fill(0);

    this.barChartData = {
      labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'],
      datasets: [{
        data: bins,
        backgroundColor: '#4BC0C0',
        label: 'Distribuție note'
      }]
    };
  }


}
