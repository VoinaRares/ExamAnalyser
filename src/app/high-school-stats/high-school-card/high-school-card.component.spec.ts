import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighSchoolCardComponent } from './high-school-card.component';
import { HighschoolStats } from '../../shared/model/highSchoolStats';

describe('HighSchoolCardComponent', () => {
  let component: HighSchoolCardComponent;
  let fixture: ComponentFixture<HighSchoolCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighSchoolCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HighSchoolCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have stats input defined', () => {
    const mockStats: HighschoolStats = {
      highschool: 'Liceul Teoretic',
      averageGrade: 9.5,
      passingPercentage: 95,
      totalCandidates: 200,
      profile: ['Matematică-Informatică', 'Științe ale Naturii'],
    } as HighschoolStats;
    fixture.componentRef.setInput('stats', mockStats);
    fixture.detectChanges();

    expect(component.stats()).toEqual(mockStats);
  });
});
