import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExamViewerComponent } from './exam-viewer/exam-viewer.component';
import { HomepageComponent } from './homepage/homepage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExamViewerComponent, HomepageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ExamAnalyser';
}
