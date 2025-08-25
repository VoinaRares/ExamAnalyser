import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountySelectorComponent } from './county-selector.component';
import { County } from '../../shared/county.enum';
import { FormsModule } from '@angular/forms';

describe('CountySelectorComponent', () => {
  let component: CountySelectorComponent;
  let fixture: ComponentFixture<CountySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CountySelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CountySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have counties array populated from County enum', () => {
    expect(component.counties).toEqual(Object.values(County));
  });

  it('should emit selected county when emitSelectedCounty is called', () => {
    const emitSpy = spyOn(component.county, 'emit');
    const firstCounty = component.counties[0];
    component.selectedCounty = firstCounty;
    component.emitSelectedCounty();
    expect(emitSpy).toHaveBeenCalledWith(component.selectedCounty);
  });
  it('should log selected county when emitSelectedCounty is called', () => {
    const logSpy = spyOn(console, 'log');
    const firstCounty = component.counties[0];
    component.selectedCounty = firstCounty;
    component.emitSelectedCounty();
    expect(logSpy).toHaveBeenCalledWith(component.selectedCounty);
  });
});
