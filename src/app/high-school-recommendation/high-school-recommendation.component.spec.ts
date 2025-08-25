import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HighSchoolRecommendationComponent } from './high-school-recommendation.component';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';

describe('HighSchoolRecommendationComponent', () => {
  let component: HighSchoolRecommendationComponent;
  let fixture: ComponentFixture<HighSchoolRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighSchoolRecommendationComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();
    const fixture = TestBed.createComponent(HighSchoolRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.value).toEqual({
      romana: null,
      matematica: null,
      preferinta1: '',
      preferinta2: '',
      preferinta3: '',
    });
  });

  it('should validate form fields correctly', () => {
    const romanaControl = component.form.get('romana');
    const matematicaControl = component.form.get('matematica');
    const preferinta1Control = component.form.get('preferinta1');

    romanaControl?.setValue(11);
    expect(romanaControl?.valid).toBeFalse();
    romanaControl?.setValue(0);
    expect(romanaControl?.valid).toBeFalse();
    romanaControl?.setValue(5);
    expect(romanaControl?.valid).toBeTrue();

    matematicaControl?.setValue(11);
    expect(matematicaControl?.valid).toBeFalse();
    matematicaControl?.setValue(0);
    expect(matematicaControl?.valid).toBeFalse();
    matematicaControl?.setValue(7);
    expect(matematicaControl?.valid).toBeTrue();

    preferinta1Control?.setValue('');
    expect(preferinta1Control?.valid).toBeFalse();
    preferinta1Control?.setValue('Matematică-Informatică');
    expect(preferinta1Control?.valid).toBeTrue();
  });

  it('should return correct values from getters', () => {
    component.form.get('preferinta1')?.setValue('Filologie');
    component.form.get('preferinta2')?.setValue('Economic');

    expect(component.preferinta1).toBe('Filologie');
    expect(component.preferinta2).toBe('Economic');
  });

  //Figure out what on submit should do
  it('should ... on submit if form is valid', () =>{

  });
});
