import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, MenuComponent, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isAuthenticated: boolean = false;
  centres: any[] = [];
  selectedCentre: string = '';
  userFullName: string = '';
  userInfo: { email: string, avatarUrl: string } = { email: '', avatarUrl: 'assets/images/profile_user.png' };

  @ViewChild('closeBtnOffCanvas') closeBtnOffCanvas!: ElementRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = !!this.authService.getToken();
    this.userInfo = this.authService.getUserInfo(); // Appel à getUserInfo() pour récupérer les infos de l'utilisateur
  console.log(this.userInfo); // Vérifie dans la console que tu obtiens bien l'email et l'avatar
  }
  logout() {
    this.authService.logout();
    
  }
 

  closeOffCanvas(): void {
    if (this.closeBtnOffCanvas?.nativeElement) {
      this.closeBtnOffCanvas.nativeElement.click();
    }
  }
}
