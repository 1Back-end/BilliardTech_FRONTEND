import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNotesComponent } from './save-notes.component';

describe('SaveNotesComponent', () => {
  let component: SaveNotesComponent;
  let fixture: ComponentFixture<SaveNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
