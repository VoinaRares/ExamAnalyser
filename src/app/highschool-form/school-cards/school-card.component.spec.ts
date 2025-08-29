import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolCardComponent } from './school-card.component';
import { By } from '@angular/platform-browser';
import { SpecializationGroup } from '../../shared/model/specialization-group.interface';

describe('SchoolCardComponent', () => {
  let component: SchoolCardComponent;
  let fixture: ComponentFixture<SchoolCardComponent>;

  const mockSpecialization: SpecializationGroup = {
    school: 'Colegiul Național A',
    code: '123',
    county: 'Alba',
    specialization: 'Matematică-Informatică',
    language: 'Română',
    candidates: [],
    highestAdmissionGrade: 9.45,
    lowestAdmissionGrade: 7.55,
    firstCandidate: { mabs: 9.123, rank: 1 } as any,
    lastCandidate: { mabs: '7,44', rank: 30 } as any,
    positionRange: '1-30',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolCardComponent);
    component = fixture.componentInstance;
    component.specialization = mockSpecialization;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display school name and specialization', () => {
    const schoolNameEl = fixture.debugElement.query(
      By.css('.school-name')
    ).nativeElement;
    expect(schoolNameEl.textContent).toContain('Colegiul Național A');

    const specializationEl = fixture.debugElement.query(
      By.css('.mb-2 span')
    ).nativeElement;
    expect(specializationEl.textContent).toContain('Matematică-Informatică');
  });

  it('should display language', () => {
    const languageEl = fixture.debugElement.queryAll(By.css('.mb-2'))[1]
      .nativeElement;
    expect(languageEl.textContent).toContain('Română');
  });

  it('should display first candidate info when provided', () => {
    const firstCandidateEl = fixture.debugElement.queryAll(By.css('.mb-2'))[2]
      .nativeElement;
    expect(firstCandidateEl.textContent).toContain('9.12');
    expect(firstCandidateEl.textContent).toContain('poziția 1');
  });

  it('should display last candidate info when provided', () => {
    const lastCandidateEl = fixture.debugElement.queryAll(By.css('.mb-2'))[3]
      .nativeElement;
    expect(lastCandidateEl.textContent).toContain('7.44');
    expect(lastCandidateEl.textContent).toContain('poziția 30');
  });

  it('should display position range when provided', () => {
    const positionRangeEl = fixture.debugElement.queryAll(By.css('.mb-2'))[4]
      .nativeElement;
    expect(positionRangeEl.textContent).toContain('1-30');
  });

  it('should not show occupancy rate by default', () => {
    const occupancyEl = fixture.debugElement.query(By.css('.occupancy'));
    expect(occupancyEl).toBeNull();
  });

  it('should show occupancy rate when showOccupationRate is true', () => {
    fixture.componentRef.setInput('showOccupationRate', true);
    fixture.componentRef.setInput('occupationRate', '75');
    fixture.detectChanges();

    const occupancyEl = fixture.debugElement.query(
      By.css('.occupancy')
    ).nativeElement;
    expect(occupancyEl.textContent).toContain('75%');
  });

  describe('formatGrade', () => {
    it('should format number grade to 2 decimals', () => {
      expect(component.formatGrade(9.123)).toBe('9.12');
    });

    it('should format string grade with comma to 2 decimals', () => {
      expect(component.formatGrade('7,44')).toBe('7.44');
    });
  });
});
