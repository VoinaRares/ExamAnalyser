import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { LastAdmissionRankerComponent } from './last-admission-ranker.component';
import { RankerStateService } from '../shared/service/last.admission-ranker.state.service';
import { DataService } from '../shared/service/data.service';
import { HighschoolFilter } from '../shared/model/highschool-filter.interface';

describe('LastAdmissionRankerComponent', () => {
  let component: LastAdmissionRankerComponent;
  let fixture: ComponentFixture<LastAdmissionRankerComponent>;

  let mockStateService: jasmine.SpyObj<RankerStateService>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj(
      'RankerStateService',
      [
        'getSchoolOptions',
        'getSpecOptions',
        'applyFilter',
        'removeFilter',
        'resetFilters'
      ],
      {
        chartData$: of([]),
        appliedFilters$: of([])
      }
    );

    mockDataService = jasmine.createSpyObj('DataService', ['getCounties']);

    await TestBed.configureTestingModule({
      imports: [LastAdmissionRankerComponent],
      providers: [
        { provide: RankerStateService, useValue: mockStateService },
        { provide: DataService, useValue: mockDataService }
      ]
    })
      .overrideComponent(LastAdmissionRankerComponent, {
        set: { providers: [] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(LastAdmissionRankerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load counties from dataService', fakeAsync(() => {
      const fakeCounties = [{ label: 'Brașov', value: 'BV' }];
      mockDataService.getCounties.and.returnValue(of(fakeCounties));

      component.ngOnInit();
      tick();

      expect(mockDataService.getCounties).toHaveBeenCalled();
      expect(component.counties).toEqual(fakeCounties);
    }));
  });

  describe('onPendingCountyChange', () => {
    it('should reset schools and fetch new school options when county is selected', fakeAsync(() => {
      const fakeSchools = [{ label: 'Șaguna', value: '0861101216' }];
      mockStateService.getSchoolOptions.and.returnValue(of(fakeSchools));

      component.pendingCounty = 'BV';
      component.onPendingCountyChange();
      tick();

      expect(mockStateService.getSchoolOptions).toHaveBeenCalledWith('BV');
      expect(component.schoolOptions).toEqual(fakeSchools);
      expect(component.pendingSchool).toBe('');
      expect(component.pendingSpec).toBe('');
    }));

    it('should reset selections but not call state if county is empty', () => {
      component.pendingCounty = '';
      component.onPendingCountyChange();

      expect(mockStateService.getSchoolOptions).not.toHaveBeenCalled();
      expect(component.pendingSchool).toBe('');
      expect(component.pendingSpec).toBe('');
    });
  });

  describe('onSchoolChange', () => {
    it('should reset specs and fetch spec options when school is selected', fakeAsync(() => {
      const fakeSpecs = [{ label: 'Mate-Info', value: '107' }];
      mockStateService.getSpecOptions.and.returnValue(of(fakeSpecs));

      component.pendingCounty = 'BV';
      component.pendingSchool = '0861101216';
      component.onSchoolChange();
      tick();

      expect(mockStateService.getSpecOptions).toHaveBeenCalledWith('BV', '0861101216');
      expect(component.specOptions).toEqual(fakeSpecs);
      expect(component.pendingSpec).toBe('');
    }));

    it('should reset spec selections but not call state if county or school is empty', () => {
      component.pendingCounty = '';
      component.pendingSchool = '';
      component.onSchoolChange();

      expect(mockStateService.getSpecOptions).not.toHaveBeenCalled();
      expect(component.pendingSpec).toBe('');
      expect(component.specOptions).toEqual([]);
    });
  });

  describe('applyFilter', () => {
    it('should call state.applyFilter with correct filter when all pending values are set', () => {
      component.pendingCounty = 'BV';
      component.pendingSchool = '0861101216';
      component.pendingSpec = '107';

      component.applyFilter();

      const expected: HighschoolFilter = {
        county: 'BV',
        school: '0861101216',
        spec: '107',
        label: 'BV | 0861101216 | 107'
      };

      expect(mockStateService.applyFilter).toHaveBeenCalledWith(expected);
    });

    it('should not call applyFilter if any pending value is missing', () => {
      component.pendingCounty = 'BV';
      component.pendingSchool = '';
      component.pendingSpec = '';

      component.applyFilter();

      expect(mockStateService.applyFilter).not.toHaveBeenCalled();
    });
  });

  describe('removeFilter', () => {
    it('should call state.removeFilter with index', () => {
      component.removeFilter(2);
      expect(mockStateService.removeFilter).toHaveBeenCalledWith(2);
    });
  });

  describe('resetChart', () => {
    it('should clear pending selections and call state.resetFilters', () => {
      component.pendingCounty = 'BV';
      component.pendingSchool = '0861101216';
      component.pendingSpec = '107';
      component.schoolOptions = [{ label: 'test', value: 'x' }];
      component.specOptions = [{ label: 'test', value: 'y' }];

      component.resetChart();

      expect(component.pendingCounty).toBe('');
      expect(component.pendingSchool).toBe('');
      expect(component.pendingSpec).toBe('');
      expect(component.schoolOptions).toEqual([]);
      expect(component.specOptions).toEqual([]);
      expect(mockStateService.resetFilters).toHaveBeenCalled();
    });
  });
});
