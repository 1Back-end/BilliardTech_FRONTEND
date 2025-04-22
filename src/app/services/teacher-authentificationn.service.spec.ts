import { TestBed } from '@angular/core/testing';

import { TeacherAuthentificationnService } from './teacher-authentificationn.service';

describe('TeacherAuthentificationnService', () => {
  let service: TeacherAuthentificationnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherAuthentificationnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
