import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HighSchoolStatsComponent } from './high-school-stats.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { baccalaureateService } from '../shared/service/baccalaureate.service';
import { HighschoolStats } from '../shared/model/highSchoolStats';
import { County } from '../shared/county.enum';
import { CountyAbbreviation } from '../shared/countyAbbreviation.enum';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

class ActivatedRouteStub {
  snapshot = {
    paramMap: {
      get: (_: string): string | null => null,
    },
    queryParamMap: {
      get: (_: string): string | null => null,
      getAll: (_: string): string[] => [],
    },
  };
}

class BaccalaureateServiceStub {
  getStatsByCounty = jasmine
    .createSpy('getStatsByCounty')
    .and.returnValue(of([]));
}

describe('HighSchoolStatsComponent', () => {
  let component: HighSchoolStatsComponent;
  let fixture: ComponentFixture<HighSchoolStatsComponent>;
  let service: BaccalaureateServiceStub;
  let router: RouterStub;
  let route: ActivatedRouteStub;

  const mockData: HighschoolStats[] = [
    {
      highschool: 'Colegiul A',
      averageGrade: 8,
      passingPercentage: 90,
      totalCandidates: 100,
      profile: ['Mate-Info', 'Uman'],
    },
    {
      highschool: 'Colegiul B',
      averageGrade: 6,
      passingPercentage: 70,
      totalCandidates: 50,
      profile: ['Real'],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighSchoolStatsComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: baccalaureateService, useClass: BaccalaureateServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HighSchoolStatsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(baccalaureateService) as any;
    router = TestBed.inject(Router) as any;
    route = TestBed.inject(ActivatedRoute) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load county data when county param is valid', fakeAsync(() => {
      spyOn(route.snapshot.paramMap, 'get').and.returnValue(
        County.Alba as string
      );
      service.getStatsByCounty.and.returnValue(of(mockData));

      component.ngOnInit();
      tick();

      expect(component.selectedCounty).toBe(County.Alba);
      expect(component.showHighschools.length).toBe(2);
      expect(component.availableProfiles).toContain('Mate-Info');
      expect(service.getStatsByCounty).toHaveBeenCalledWith(
        CountyAbbreviation.Alba
      );
    }));

    it('should not load data when county param is invalid', () => {
      spyOn(route.snapshot.paramMap, 'get').and.returnValue(
        'InvalidCounty' as string
      );

      component.ngOnInit();

      expect(service.getStatsByCounty).not.toHaveBeenCalled();
      expect(component.selectedCounty).toBe('');
    });
  });

  describe('onCountySelected', () => {
    it('should update selectedCounty and call service', fakeAsync(() => {
      service.getStatsByCounty.and.returnValue(of(mockData));

      component.onCountySelected(County.Brașov);
      tick();

      expect(component.selectedCounty).toBe(County.Brașov);
      expect(service.getStatsByCounty).toHaveBeenCalledWith(
        CountyAbbreviation.Brașov
      );
      expect(router.navigate).toHaveBeenCalledWith([
        '/statistici-licee',
        County.Brașov,
      ]);
    }));
  });

  describe('applySort', () => {
    beforeEach(() => {
      component.showHighschools = [...mockData];
    });

    it('should sort by ascending average grade', () => {
      component.applySort('medie bac crescător');
      expect(component.showHighschools[0].averageGrade).toBe(6);
    });

    it('should sort alphabetically descending', () => {
      component.applySort('alfabetic descrescător');
      expect(component.showHighschools[0].highschool).toBe('Colegiul B');
    });

    it('should close sort modal', () => {
      component.showSortModal = true;
      component.applySort('medie bac crescător');
      expect(component.showSortModal).toBeFalse();
    });
  });

  describe('filters', () => {
    beforeEach(() => {
      component.highschools = mockData;
      component.showHighschools = mockData;
    });

    it('should apply filters correctly', () => {
      component.filters.minMean = 7;
      component.applyFilters();

      expect(component.showHighschools.length).toBe(1);
      expect(component.showHighschools[0].highschool).toBe('Colegiul A');
    });

    it('should reset filters fully when none selected', () => {
      component.filters = {
        profil: ['Mate-Info'],
        minMean: 5,
        minPromotionPercent: 60,
      };
      component.showOnlyMean = false;
      component.showOnlyProfiles = false;
      component.showOnlyPromRate = false;

      component.resetFilters();

      expect(component.filters.minMean).toBe(0);
      expect(component.filters.profil.length).toBe(0);
      expect(component.showHighschools).toBe(component.highschools);
    });

    it('should remove filter by key', () => {
      component.filters.minMean = 7;
      component.removeFilter('min-mean');
      expect(component.filters.minMean).toBe(0);
    });
  });

  describe('modals', () => {
    it('should open and close filter modal', () => {
      component.showFilter();
      expect(component.showFilterModal).toBeTrue();

      component.closeFilterModal();
      expect(component.showFilterModal).toBeFalse();
    });

    it('should set flags in showPartOfFilter', () => {
      component.showPartOfFilter('mean');
      expect(component.showOnlyMean).toBeTrue();

      component.showPartOfFilter('profiles');
      expect(component.showOnlyProfiles).toBeTrue();

      component.showPartOfFilter('promotion');
      expect(component.showOnlyPromRate).toBeTrue();
    });
  });

  describe('stats modal', () => {
    it('should open and close stats modal', () => {
      component.openStatsModal(mockData[0]);
      expect(component.selectedHighschool).toBe(mockData[0]);
      expect(component.showStatsModal).toBeTrue();

      component.closeStatsModal();
      expect(component.selectedHighschool).toBeNull();
      expect(component.showStatsModal).toBeFalse();
    });
  });

  describe('navigation', () => {
    it('should navigate home', () => {
      component.navigateHome();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
