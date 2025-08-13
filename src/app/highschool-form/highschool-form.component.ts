import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../shared/service/data.service';
import { SchoolCardComponent } from './school-cards/school-card.component';
import { SpecializationGroup } from '../shared/model/specialization-group.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './highschool-form.component.html',
  styleUrl: './highschool-form.component.scss',
})
export class HighschoolFormComponent implements OnInit {
  form: FormGroup<{
    county: FormControl<string | null>;
    year: FormControl<number | null>;
    grade: FormControl<number | null>;
    delimiter: FormControl<number | null>;
  }>;

  activeSort = 'asc'
  counties: { label: string; value: string }[] = [];
  years: number[] = [];
  specializationGroups: SpecializationGroup[] = [];
  showOccupancy: boolean = false;

  occupationRate: Record<string,string>={}

  route = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.form = this.fb.group({
      county: this.fb.control<string | null>(null, Validators.required),
      year: this.fb.control<number | null>(null, Validators.required),
      grade: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
      delimiter: this.fb.control<number | null>(null),
    });
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      const countyParam = params.get('judet');
      const yearParam = params.get('an');
      const gradeParam = params.get('nota');
      const delimiterParam = params.get('delimiter');

      this.form.patchValue({
        county: countyParam,
        year: yearParam ? Number(yearParam) : null,
        grade: gradeParam !== null ? Number(gradeParam) : null,
        delimiter: delimiterParam !== null ? Number(delimiterParam) : null,
      }, { emitEvent: false });

      if (countyParam && yearParam && gradeParam !== null) {
        this.dataService
          .getGroupedSchools(countyParam, Number(yearParam))
          .subscribe((groups: SpecializationGroup[]) => {
            this.specializationGroups = groups
              .filter(group => Number(gradeParam) >= group.lowestAdmissionGrade)
              .sort((a, b) => b.lowestAdmissionGrade - a.lowestAdmissionGrade);
          });

        this.dataService.getAvailableYears(countyParam).subscribe((years: number[]) => {
          this.years = years;
        });
      }
    });

    this.form.get('county')?.valueChanges.subscribe((county) => {
      if (county) {
        this.dataService
          .getAvailableYears(county)
          .subscribe((years: number[]) => {
            this.years = years;
            this.form.get('year')?.reset();
          });
      }
    });

    this.dataService.getCounties().subscribe((counties) => {
      this.counties = counties;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { county, year, grade } = this.form.value;

    if (county && year && grade != null) {
      this.dataService
        .getGroupedSchools(county, year)
        .subscribe((groups: SpecializationGroup[]) => {
          this.specializationGroups = groups
            .filter((group) => grade >= group.lowestAdmissionGrade)
            .sort((a, b) => b.lowestAdmissionGrade - a.lowestAdmissionGrade);
        });
    }

    this.router.navigate(['/recomandare-liceu'],
       {
      relativeTo: this.route,
      queryParams: {
        judet: county,
        an: year,
        nota: grade,
        delimiter: this.form.get('delimiter')?.value || null,
      },
      queryParamsHandling: 'merge'
    });
  }

  goToRanker() {
    this.router.navigate(['/clasament-ultimele-admiteri']);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  //pentru sortarea dupa grad ocupare pe care o voi face ulterior
  setSort(sort: string) {
    this.activeSort = sort
  }

  onToggleChange() {
    if (this.showOccupancy) {
      if(Object.keys(this.occupationRate).length === 0)
      {
        for (let highschool of this.specializationGroups)
        {
            let numberOfCandidates= highschool.candidates.length

            let occupationNumber=highschool.candidates.filter((item)=> Number(item.madm) >= Number(this.form.value.grade) && this.dataService.extractSpecializationName(item.sp)==highschool.specialization).length
            this.occupationRate[highschool.school+highschool.specialization]=(occupationNumber/numberOfCandidates*100).toFixed(2)
        }
        //console.log(this.occupationRate)
      }
    } else {
      // logica când e dezactivat
      console.log("Gradul de ocupare este ascuns");
    }
  }
  get countyControl() { return this.form.get('county'); }
  get yearControl() { return this.form.get('year'); }
  get gradeControl() { return this.form.get('grade'); }
}
