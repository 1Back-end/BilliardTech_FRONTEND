
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { CONFIG } from '../../config'
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object, 
    private router: Router,
    private toastr: ToastrService,
  ) {}

  setUserToLocalStorage(user: any): void {
    const encodedUser = btoa(JSON.stringify(user));
    localStorage.setItem('user', encodedUser);
  }
  
  getUserFromLocalStorage(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(atob(data)) : null;
  }
  
  getUserRole(): string | null {
    const user = this.getUserFromLocalStorage();
    return user?.role || null;
  }
}
