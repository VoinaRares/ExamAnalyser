import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent, CardModule],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /bac-chart when goToStats() is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToStats();
    expect(navigateSpy).toHaveBeenCalledWith(['/bac-chart']);
  });

  it('should have three feature cards in the template', () => {
    const cards = fixture.debugElement.queryAll(By.css('.feature-card'));
    expect(cards.length).toBe(3);
  });

  it('should display homepage title', () => {
    const titleEl = fixture.debugElement.query(By.css('.app-title')).nativeElement;
    expect(titleEl.textContent).toContain('AILiceu');
  });

  it('should display description text', () => {
    const descEls = fixture.debugElement.queryAll(By.css('.description-text'));
    expect(descEls.length).toBe(2);
  });
});
