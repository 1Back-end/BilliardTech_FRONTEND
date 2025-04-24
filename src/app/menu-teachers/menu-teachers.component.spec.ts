import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTeachersComponent } from './menu-teachers.component';

describe('MenuTeachersComponent', () => {
  let component: MenuTeachersComponent;
  let fixture: ComponentFixture<MenuTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTeachersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
