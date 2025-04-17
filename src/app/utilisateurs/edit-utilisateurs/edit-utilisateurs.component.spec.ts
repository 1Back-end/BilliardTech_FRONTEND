import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUtilisateursComponent } from './edit-utilisateurs.component';

describe('EditUtilisateursComponent', () => {
  let component: EditUtilisateursComponent;
  let fixture: ComponentFixture<EditUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUtilisateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
