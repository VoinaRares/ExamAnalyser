import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SpecializationGroup } from '../specialization-group.interface';

@Component({
  selector: 'app-school-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './school-card.component.html',
  styleUrls: ['./school-card.component.scss'],
})
export class SchoolCardComponent {
  @Input() specialization!: SpecializationGroup;

  formatGrade(grade: string | number): string {
    if (typeof grade === 'string') {
      return parseFloat(grade.replace(',', '.')).toFixed(2);
    }
    return grade.toFixed(2);
  }
}
