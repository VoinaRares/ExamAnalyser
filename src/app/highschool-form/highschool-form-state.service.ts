import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable, tap } from 'rxjs';
import { HighschoolFacadeService } from './highschool-data-facade.service';

@Injectable()
export class HighschoolFormStateService {
  form: FormGroup;
  counties$: Observable<{ label: string; value: string }[]>;
  counties: { label: string; value: string }[] = [];
  years: number[] = [];
  specializationGroups: any[] = [];
  showOccupancy = false;
  occupationRate: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private facade: HighschoolFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      county: [null, Validators.required],
      year: [null, Validators.required],
      grade: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      delimiter: [null],
    });

    this.counties$ = this.facade.getCounties();
  }

  initialize() {
    return this.facade.getCounties().pipe(
      tap((counties) => (this.counties = counties)),
      switchMap(() => this.route.queryParams),
      tap((params) => {
        const county = params['county'] || null;
        const year = params['year'] ? +params['year'] : null;
        const grade = params['grade'] ? +params['grade'] : null;
        const delimiter = params['delimiter'] ? +params['delimiter'] : null;

        this.form.patchValue({ county, year, grade, delimiter });
        this.loadGroupsIfValid();
      })
    );
  }

  private loadGroupsIfValid() {
    if (this.form.valid) {
      const { county, year, grade } = this.form.value;
      this.facade
        .loadFilteredSpecializationGroups(county, year, grade)
        .subscribe((groups) => (this.specializationGroups = groups));
    }
  }

  loadYears(county: string) {
    this.facade.getAvailableYears(county).subscribe((years) => {
      this.years = years;
    });
  }

  handleCountyChange() {
    this.form.get('county')!.valueChanges.subscribe((county) => {
      this.years = [];
      this.form.get('year')!.reset();
      if (county) this.loadYears(county);
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { county, year, grade, delimiter } = this.form.value;
    this.router.navigate([], {
      queryParams: { county, year, grade, delimiter },
      queryParamsHandling: 'merge',
    });

    this.facade
      .loadFilteredSpecializationGroups(county, year, grade)
      .subscribe((groups) => (this.specializationGroups = groups));
  }

  toggleOccupancy() {
    this.showOccupancy = !this.showOccupancy;

    if (this.showOccupancy && this.specializationGroups.length > 0) {
      const grade = this.form.value.grade;
      this.occupationRate = this.facade.getOccupationRates(
        this.specializationGroups,
        grade
      );
    }
  }
}
