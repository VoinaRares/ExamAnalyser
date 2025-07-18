import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../data.service';
import { SchoolCardComponent } from '../school-cards/school-card.component';
import { SpecializationGroup } from '../specialization-group.interface';

@Component({
  selector: 'app-highschool-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    SchoolCardComponent
  ],
  templateUrl: './highschool-form.component.html',
  styleUrl: './highschool-form.component.scss'
})
export class HighschoolFormComponent implements OnInit {
  form: FormGroup<{
    county: FormControl<string | null>;
    year: FormControl<number | null>;
    grade: FormControl<number | null>;
    delimiter: FormControl<number | null>;
  }>;

  counties = [
    { label: 'Brașov', value: 'brasov' },
  ];

  years: number[] = [];
  specializationGroups: SpecializationGroup[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.form = this.fb.group({
      county: this.fb.control<string | null>(null, Validators.required),
      year: this.fb.control<number | null>(null, Validators.required),
      grade: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(10)]),
      delimiter: this.fb.control<number | null>(null)
    });
  }

  ngOnInit() {
    this.form.get('county')?.valueChanges.subscribe((county) => {
      if (county) {
        this.dataService.getAvailableYears(county).subscribe((years: number[]) => {
          this.years = years;
          this.form.get('year')?.reset();
        });
      }
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      console.warn('Form is invalid');
      return;
    }

    const { county, year, grade } = this.form.value;

    if (county && year && grade != null) {
      this.dataService.getGroupedSchools(county, year).subscribe((groups: SpecializationGroup[]) => {
        this.specializationGroups = groups
          .filter((group) => grade >= group.lowestAdmissionGrade)
          .sort((a, b) => b.lowestAdmissionGrade - a.lowestAdmissionGrade);
      });
    }
  }
}
