import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-viewer',
  imports: [CommonModule],
  templateUrl: './exam-viewer.component.html',
  standalone: true
})
export class ExamViewerComponent {
  data: any;
  error: any;

  constructor(private dataService: DataService) {}

  fetchData(examType: string, year: string) {
    this.dataService.getExamData(examType, year).subscribe({
      next: (result) => {
        this.data = result;
        this.error = null;
      },
      error: (err) => {
        this.error = err;
        this.data = null;
      }
    });
  }
}
