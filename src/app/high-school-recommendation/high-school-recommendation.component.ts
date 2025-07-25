import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { County } from '../shared/county.enum';

@Component({
  selector: 'app-high-school-recommendation',
  imports: [ReactiveFormsModule],
  templateUrl: './high-school-recommendation.component.html',
  styleUrl: './high-school-recommendation.component.scss'
})
export class HighSchoolRecommendationComponent {
  form: FormGroup;
  profiles: string[] = [
    'Matematică-Informatică',
    'Științe ale Naturii',
    'Filologie',
    'Economic',
    'Tehnic',
    'Sportiv'
  ];
  counties: string[] = Object.values(County); 

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      romana: [null, [Validators.min(1), Validators.max(10)]],
      matematica: [null, [Validators.min(1), Validators.max(10)]],
      preferinta1: ['', Validators.required],
      preferinta2: [''],
      preferinta3: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formular trimis:', this.form.value);
      // aici poți adăuga logica de recomandare
    }
  }

  get preferinta1() {
    return this.form.get('preferinta1')?.value;
  }

  get preferinta2() {
    return this.form.get('preferinta2')?.value;
  }
}
