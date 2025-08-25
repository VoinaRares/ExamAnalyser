import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BacPieChartComponent } from './bac-pie-chart.component';
import { DataService } from '../shared/service/data.service';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { of } from 'rxjs';

describe('BacPieChartComponent', () => {
  let component: BacPieChartComponent;
  let fixture: ComponentFixture<BacPieChartComponent>;

  const mockBacData = [
    { 'Unitatea de învăţământ': 'Liceu1', Specializare: 'Math', Media: '6.5' },
    {
      'Unitatea de învăţământ': 'Liceu1',
      Specializare: 'Science',
      Media: '7.8',
    },
    { 'Unitatea de învăţământ': 'Liceu2', Specializare: 'Math', Media: '' },
    {
      'Unitatea de învăţământ': 'Liceu2',
      Specializare: 'Science',
      Media: '9.5',
    },
  ];

  const mockDataService = {
    loadBacData: () => of(mockBacData),
    getBacLicee: () =>
      Array.from(new Set(mockBacData.map((d) => d['Unitatea de învăţământ']))),
    getBacSpecializari: (liceu?: string) =>
      Array.from(
        new Set(
          mockBacData
            .filter((d) => !liceu || d['Unitatea de învăţământ'] === liceu)
            .map((d) => d['Specializare'])
        )
      ),
    getBacNoteDistribuite: (liceu?: string, specializare?: string) => {
      const filtered = mockBacData.filter(
        (d) =>
          (!liceu || d['Unitatea de învăţământ'] === liceu) &&
          (!specializare || d['Specializare'] === specializare)
      );

      const distribution: Record<string, number> = {};

      filtered.forEach((d) => {
        const key = d['Media'] ?? '';
        distribution[key] = (distribution[key] || 0) + 1;
      });

      return distribution;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacPieChartComponent, FormsModule, NgChartsModule],
      providers: [{ provide: DataService, useValue: mockDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BacPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load licee and specializari on init', () => {
    expect(component.licee).toEqual(['Liceu1', 'Liceu2']);
    expect(component.specializari).toEqual(['Math', 'Science']);
  });

  it('should initialize pieChartData correctly', () => {
    const expectedData = [1, 0, 1, 1, 0, 1];
    const expectedLabels = [
      'Neprezentat',
      'Respins (<6)',
      '6 - 6.99',
      '7 - 7.99',
      '8 - 8.99',
      '9 - 10',
    ];

    expect(component.pieChartData.datasets[0].data).toEqual(expectedData);
    expect(component.pieChartData.labels).toEqual(expectedLabels);
  });

  it('should update specializari when selectedLiceu changes', () => {
    component.selectedLiceu = 'Liceu1';
    component.onLiceuChange();

    expect(component.specializari).toEqual(['Math', 'Science']);
    expect(component.selectedSpecializare).toBeUndefined();

    const data = component.pieChartData.datasets[0].data;
    expect(data).toEqual([0, 0, 1, 1, 0, 0]);
  });

  it('should update chart when selectedSpecializare changes', () => {
    component.selectedSpecializare = 'Math';
    component.onSpecializareChange();

    const data = component.pieChartData.datasets[0].data;
    expect(data).toEqual([1, 0, 1, 0, 0, 0]);
  });

  it('should handle combined selection of liceu and specializare', () => {
    component.selectedLiceu = 'Liceu1';
    component.selectedSpecializare = 'Math';
    component.onSpecializareChange();

    const data = component.pieChartData.datasets[0].data;
    expect(data).toEqual([0, 0, 1, 0, 0, 0]);
  });
});
