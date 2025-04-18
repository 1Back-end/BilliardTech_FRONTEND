import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfesseursComponent } from './add-professeurs.component';

describe('AddProfesseursComponent', () => {
  let component: AddProfesseursComponent;
  let fixture: ComponentFixture<AddProfesseursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProfesseursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProfesseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
