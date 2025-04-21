import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationsCoursesComponent } from './affectations-courses.component';

describe('AffectationsCoursesComponent', () => {
  let component: AffectationsCoursesComponent;
  let fixture: ComponentFixture<AffectationsCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectationsCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectationsCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
