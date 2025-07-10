  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
  import { InputNumberModule } from 'primeng/inputnumber';
  import { InputTextModule } from 'primeng/inputtext';
  import { ButtonModule } from 'primeng/button';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-highschool-form',
    standalone: true,
    imports: [ReactiveFormsModule, InputNumberModule, InputTextModule, ButtonModule, CommonModule],
    templateUrl: './highschool-form.component.html',
    styleUrl: './highschool-form.component.scss'
  })
  export class HighschoolFormComponent {
    years = [
      { label: '2025', value: 2025 },
      { label: '2024', value: 2024 },
      { label: '2023', value: 2023 },
      { label: '2022', value: 2022 }
    ];
    form: FormGroup;

    constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        year: [null, Validators.required],
        grade: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
        delimiter: ['']
      });
    }

    onSubmit() {
      // For now, do nothing or log the form value
      console.log(this.form.value);
    }
  }
