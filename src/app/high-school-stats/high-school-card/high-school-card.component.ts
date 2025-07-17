import { Component, input } from '@angular/core';
import { HighschoolStats } from '../../shared/model/highSchoolStats';

@Component({
  selector: 'app-high-school-card',
  imports: [],
  templateUrl: './high-school-card.component.html',
  styleUrl: './high-school-card.component.scss'
})
export class HighSchoolCardComponent {
    stats=input<HighschoolStats>();
}
