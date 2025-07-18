import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SpecializationGroup } from '../specialization-group.interface';
import { RawExaminee } from '../raw-examinee.interface';

@Component({
  selector: 'app-school-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './school-card.component.html',
  styleUrls: ['./school-card.component.scss'],
})
export class SchoolCardComponent{
  @Input() specialization!: SpecializationGroup;
}
