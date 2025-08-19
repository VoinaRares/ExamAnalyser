import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SchoolCardComponent } from './school-cards/school-card.component';
import { HighschoolFormStateService } from './highschool-form-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-highschool-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    SchoolCardComponent,
  ],
  templateUrl: './highschool-form.component.html',
  styleUrls: ['./highschool-form.component.scss'],
  providers: [HighschoolFormStateService],
})
export class HighschoolFormComponent implements OnInit {
  get form() {
    return this.state.form;
  }
  get counties() {
    return this.state.counties;
  }
  get years() {
    return this.state.years;
  }
  get specializationGroups() {
    return this.state.specializationGroups;
  }
  get countyControl() {
    return this.form.get('county');
  }
  get yearControl() {
    return this.form.get('year');
  }
  get gradeControl() {
    return this.form.get('grade');
  }
  get showOccupancy() {
    return this.state.showOccupancy;
  }
  get occupationRate() {
    return this.state.occupationRate;
  }

  onToggleChange() {
    this.state.toggleOccupancy();
  }

  constructor(
    public state: HighschoolFormStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.state.initialize().subscribe();
    this.state.handleCountyChange();
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.state.submit();
  }

  goToRanker() {
    this.router.navigate(['/last-admission-ranker']);
  }
}
