import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentResultsComponent } from './student-results.component';

describe('StudentResultsComponent', () => {
  let component: StudentResultsComponent;
  let fixture: ComponentFixture<StudentResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
