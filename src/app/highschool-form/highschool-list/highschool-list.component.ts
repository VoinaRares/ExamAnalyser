import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-highschool-list',
  imports: [],
  templateUrl: './highschool-list.component.html',
  styleUrl: './highschool-list.component.scss'
})
export class HighschoolListComponent {
  judet: string | null = null;
  an: string | null = null;
  nota: number | null = null;
  delimiter: number | null = null;

  route=inject(ActivatedRoute)

   ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.judet = params.get('judet');
      this.an = params.get('an');

      const notaParam = params.get('nota');
      const delimiterParam = params.get('delimiter');

      this.nota = notaParam !== null ? Number(notaParam) : null;
      this.delimiter = delimiterParam !== null ? Number(delimiterParam) : null;
    });
  }
}
