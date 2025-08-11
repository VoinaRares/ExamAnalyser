import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecializationGroup } from '../../shared/model/specialization-group.interface';
import { SchoolCardComponent } from "../school-cards/school-card.component";
import { DataService } from '../../shared/service/data.service';

@Component({
  selector: 'app-highschool-list',
  imports: [SchoolCardComponent],
  templateUrl: './highschool-list.component.html',
  styleUrl: './highschool-list.component.scss'
})
export class HighschoolListComponent {
  judet: string | null = null;
  an: string | null = null;
  nota: number | null = null;
  delimiter: number | null = null;

  route=inject(ActivatedRoute)
  dataService=inject(DataService)
  router=inject(Router)

  specializationGroups: SpecializationGroup[] = [];

   ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.judet = params.get('judet');
      this.an = params.get('an');

      const notaParam = params.get('nota');
      const delimiterParam = params.get('delimiter');

      this.nota = notaParam !== null ? Number(notaParam) : null;
      this.delimiter = delimiterParam !== null ? Number(delimiterParam) : null;
    });

    this.dataService.getGroupedSchools(this.judet!, Number(this.an)).subscribe((groups: SpecializationGroup[]) => {
      this.specializationGroups = groups
        .filter((group) => this.nota! >= group.lowestAdmissionGrade)
        .sort((a, b) => b.lowestAdmissionGrade - a.lowestAdmissionGrade);
    });
  }

  navigateHome()
  {
    this.router.navigate(['/'])
  }

  goToForm()
  {
    this.router.navigate(['/recomandare-liceu'])
  }

  goToGraph()
  {
    this.router.navigate(['//clasament-ultimele-admiteri'])
  }
}
