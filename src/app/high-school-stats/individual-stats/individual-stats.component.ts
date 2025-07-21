import { Component, output, input, inject } from '@angular/core';
import { HighschoolStats } from '../../shared/model/highSchoolStats';
import { FormsModule } from '@angular/forms';
import { baccalaureateService } from '../../shared/service/baccalaureate.service';
import { CountyAbbreviation } from '../../shared/countyAbbreviation.enum';

@Component({
  selector: 'app-individual-stats',
  imports: [FormsModule],
  templateUrl: './individual-stats.component.html',
  styleUrl: './individual-stats.component.scss'
})
export class IndividualStatsComponent {

  highschool = input<HighschoolStats>()
  county = input<string>();

  closeModal = output();
  bacService = inject(baccalaureateService)

  selectedProfile: string = '';
  mean: number | undefined = 0
  profileMean = 9;


  ngOnInit() {
    this.mean = this.highschool()?.averageGrade
  }

  close() {
    this.closeModal.emit();
  }

  onProfileChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedProfile = selectElement.value;
    this.selectedProfile = selectedProfile;
    const countyCode = CountyAbbreviation[this.county()! as keyof typeof CountyAbbreviation]

    //in profileData e dictionar cu chei numele materiei si valoare un array de note
    const profileData = this.bacService.getGradesOnProfileForHighschool(countyCode, this.highschool()!.highschool, selectedProfile)
    const rawData = this.bacService.getRawStructure();

    const profileRows = rawData[countyCode][this.highschool()!.highschool]?.[selectedProfile];
    console.log(profileRows)

    if (!profileRows) {
      this.profileMean = 0;
      return;
    }

    let mediaSum = 0;
    let count = 0;

    for (const row of profileRows) {
      const media = parseFloat(row[16]); // "Media" e pe coloana 16
      if (!isNaN(media)) {
        mediaSum += media;
        count++;
      }
    }

    this.profileMean = count ? parseFloat((mediaSum / count).toFixed(2)) : 0;
  }
}
