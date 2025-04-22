import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordTeacherComponent } from './forgot-password-teacher.component';

describe('ForgotPasswordTeacherComponent', () => {
  let component: ForgotPasswordTeacherComponent;
  let fixture: ComponentFixture<ForgotPasswordTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
