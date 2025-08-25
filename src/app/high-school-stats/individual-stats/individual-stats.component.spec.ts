import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualStatsComponent } from './individual-stats.component';
import { baccalaureateService } from '../../shared/service/baccalaureate.service';
import { CountyAbbreviation } from '../../shared/countyAbbreviation.enum';
import { HighschoolStats } from '../../shared/model/highSchoolStats';

describe('IndividualStatsComponent', () => {
  let component: IndividualStatsComponent;
  let mockBacService: any;
  let fixture: ComponentFixture<IndividualStatsComponent>;

  const mockHighschool: HighschoolStats = {
    highschool: 'Test Highschool',
    averageGrade: 7.5,
    passingPercentage: 80,
    totalCandidates: 100,
    profile: ['Real', 'Uman'],
  };

  beforeEach(() => {
    mockBacService = {
      getSubjectsForHighschool: jasmine
        .createSpy('getSubjectsForHighschool')
        .and.returnValue(['Math', 'Romanian']),
      getRawStructure: jasmine.createSpy('getRawStructure').and.returnValue({
        [CountyAbbreviation.București]: {
          'Test Highschool': {
            Real: [
              Array(20)
                .fill('')
                .map((_, i) => (i === 19 ? '7.5' : '')),
              Array(20)
                .fill('')
                .map((_, i) => (i === 19 ? '8.5' : '')),
              Array(20)
                .fill('')
                .map((_, i) => (i === 19 ? '' : '')),
            ],
            Uman: [
              Array(20)
                .fill('')
                .map((_, i) => (i === 19 ? '6.5' : '')),
              Array(20)
                .fill('')
                .map((_, i) => (i === 19 ? '5.5' : '')),
            ],
          },
        },
      }),
      getGradesOnProfileForHighschool: jasmine
        .createSpy('getGradesOnProfileForHighschool')
        .and.returnValue({
          Math: [7, 8, 9],
          Romanian: [6, 7, 8],
        }),
      getSubjectDistributions: jasmine
        .createSpy('getSubjectDistributions')
        .and.returnValue({
          Math: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5],
          Romanian: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        }),
    };

    TestBed.configureTestingModule({
      imports: [IndividualStatsComponent],
      providers: [{ provide: baccalaureateService, useValue: mockBacService }],
    });

    fixture = TestBed.createComponent(IndividualStatsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('highschool', mockHighschool);
    fixture.componentRef.setInput('county', 'București');

    component.closeModal = { emit: jasmine.createSpy('emit') } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize mean and subjects on ngOnInit', () => {
    component.ngOnInit();
    expect(component.mean).toBe(7.5);
    expect(component.subjects).toEqual(['Math', 'Romanian']);
    expect(mockBacService.getSubjectsForHighschool).toHaveBeenCalledWith(
      'București',
      'Test Highschool'
    );
  });

  it('should emit closeModal on close()', () => {
    component.close();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should update profileMean and profileSubjects on profile change', () => {
    const event = { target: { value: 'Real' } } as any;
    component.selectedProfile = '';
    component.profileSubjects = [];
    component.onProfileChange(event);
    expect(component.selectedProfile).toBe('Real');
    expect(component.profileSubjects).toEqual(['Math', 'Romanian']);
    expect(component.profileMean).toBeCloseTo(8.0, 1);
  });

  it('should set profileMean to 0 if profileRows is undefined', () => {
    mockBacService.getRawStructure.and.returnValue({
      [CountyAbbreviation.București]: {
        'Test Highschool': {},
      },
    });
    const event = { target: { value: 'Nonexistent' } } as any;
    component.onProfileChange(event);
    expect(component.profileMean).toBe(0);
  });

  it('should update generalPieChartData in updateGeneralChart', () => {
    component.updateGeneralChart();
    expect(component.generalPieChartData.labels?.length).toBe(6);
    expect(component.generalPieChartData.datasets[0].data.length).toBe(6);
    expect(
      component.generalPieChartData.datasets[0].data.reduce((a, b) => a + b, 0)
    ).toBeGreaterThan(0);
  });

  it('should handle missing schoolData in updateGeneralChart', () => {
    mockBacService.getRawStructure.and.returnValue({});
    component.updateGeneralChart();
    expect(component.generalPieChartData.labels?.length).toBe(6);
    expect(
      component.generalPieChartData.datasets[0].data.reduce((a, b) => a + b, 0)
    ).toBe(0);
  });

  it('should update profilePieChartData in updateProfileChart', () => {
    const rows = [
      Array(20)
        .fill('')
        .map((_, i) => (i === 19 ? '7.5' : '')),
      Array(20)
        .fill('')
        .map((_, i) => (i === 19 ? '8.5' : '')),
      Array(20)
        .fill('')
        .map((_, i) => (i === 19 ? '' : '')),
    ];
    component.updateProfileChart(rows);
    expect(component.profilePieChartData.labels?.length).toBe(6);
    expect(component.profilePieChartData.datasets[0].data.length).toBe(6);
    expect(
      component.profilePieChartData.datasets[0].data.reduce((a, b) => a + b, 0)
    ).toBe(3);
  });

  it('should update barChartData on onSubjectSelect', () => {
    component.onSubjectSelect('Math');
    expect(component.selectedSubject).toBe('Math');
    expect(component.barChartData.datasets[0].data).toEqual([
      0, 0, 0, 0, 0, 1, 2, 3, 4, 5,
    ]);
  });

  it('should update barProfileChartData on onProfileSubjectSelect', () => {
    component.selectedProfile = 'Real';
    component.onProfileSubjectSelect('Math');
    expect(component.selectedProfileSubject).toBe('Math');
    expect(
      component.barProfileChartData.datasets[0].data.reduce((a, b) => a + b, 0)
    ).toBe(3);
  });

  it('should handle missing subject in onSubjectSelect', () => {
    mockBacService.getSubjectDistributions.and.returnValue({});
    component.onSubjectSelect('Physics');
    expect(component.barChartData.datasets[0].data).toEqual(
      new Array(10).fill(0)
    );
  });

  it('should handle missing subject in onProfileSubjectSelect', () => {
    mockBacService.getGradesOnProfileForHighschool.and.returnValue({});
    component.selectedProfile = 'Real';
    component.onProfileSubjectSelect('Physics');
    expect(component.barProfileChartData.datasets[0].data).toEqual(
      new Array(10).fill(0)
    );
  });

  it('should correctly bin grades in onProfileSubjectSelect', () => {
    mockBacService.getGradesOnProfileForHighschool.and.returnValue({
      Math: [0.5, 1.2, 2.9, 3.1, 4.8, 5.0, 6.7, 7.8, 8.9, 9.9],
    });
    component.selectedProfile = 'Real';
    component.onProfileSubjectSelect('Math');
    expect(component.barProfileChartData.datasets[0].data).toEqual([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ]);
  });

  it('should not fail if highschool or county input is missing', () => {
    fixture.componentRef.setInput('highschool', undefined);
    fixture.componentRef.setInput('county', undefined);

    expect(() => component.ngOnInit()).not.toThrow();
    expect(() => component.updateGeneralChart()).not.toThrow();
    expect(() => component.onSubjectSelect('Math')).not.toThrow();
    expect(() => component.onProfileSubjectSelect('Math')).not.toThrow();
  });

  it('should not fail if getRawStructure returns undefined', () => {
    mockBacService.getRawStructure.and.returnValue(undefined);
    expect(() => component.updateGeneralChart()).not.toThrow();
  });

  it('should not fail if profileRows is empty in updateProfileChart', () => {
    expect(() => component.updateProfileChart([])).not.toThrow();
    expect(
      component.profilePieChartData.datasets[0].data.reduce((a, b) => a + b, 0)
    ).toBe(0);
  });
});
