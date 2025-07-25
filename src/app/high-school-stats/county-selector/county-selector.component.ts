import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { County } from '../../shared/county.enum';

@Component({
  selector: 'app-county-selector',
  imports: [FormsModule],
  templateUrl: './county-selector.component.html',
  styleUrl: './county-selector.component.scss'
})
export class CountySelectorComponent {
    selectedCounty: County| ''=''
    county=output<string>()

    counties = Object.values(County); 

    emitSelectedCounty()
    {
      console.log(this.selectedCounty)
      this.county.emit(this.selectedCounty);
    }

    
}
