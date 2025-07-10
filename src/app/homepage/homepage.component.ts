import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  imports: [CardModule, RouterModule],
  standalone: true
})
export class HomepageComponent {

}
