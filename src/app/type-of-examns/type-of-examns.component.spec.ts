import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfExamnsComponent } from './type-of-examns.component';

describe('TypeOfExamnsComponent', () => {
  let component: TypeOfExamnsComponent;
  let fixture: ComponentFixture<TypeOfExamnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeOfExamnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfExamnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
