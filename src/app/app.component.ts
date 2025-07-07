import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExamViewerComponent } from './exam-viewer/exam-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExamViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ExamAnalyser';
}
