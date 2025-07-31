import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacPieChartComponent } from './bac-pie-chart.component';

describe('BacPieChartComponent', () => {
  let component: BacPieChartComponent;
  let fixture: ComponentFixture<BacPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
