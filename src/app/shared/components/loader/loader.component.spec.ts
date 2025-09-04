import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent] 
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the loader component', () => {
    expect(component).toBeTruthy();
  });

  it('should render loader overlay', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loader-overlay')).toBeTruthy();
  });

  it('should render three spans inside loader', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const spans = compiled.querySelectorAll('.loader span');
    expect(spans.length).toBe(3);
  });
});
