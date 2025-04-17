import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorsComponent } from './profesors.component';

describe('ProfesorsComponent', () => {
  let component: ProfesorsComponent;
  let fixture: ComponentFixture<ProfesorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
