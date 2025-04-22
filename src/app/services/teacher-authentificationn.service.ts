import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { CONFIG } from '../../config'
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {LanguageHeaderService} from '../admin/language-header.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherAuthentificationnService {

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object, 
    private router: Router,
    private toastr: ToastrService,
    private languageHeaderService: LanguageHeaderService,
  ) {}


  Login(login:string,password:string):Observable<any>{
    const headers = this.languageHeaderService.getLanguageHeader();
    return this.http.post<any>(`${CONFIG.apiUrl}/teachers_authentification/login`, { login, password },{headers}).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem('teacher', btoa(JSON.stringify(response.teacher)));
        }
      }),
      catchError(error => {
        // Ne renvoie pas un message générique ici
        return throwError(() => error); // Laisse le message original du backend passer
      })
    );
  }
  Logout(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const headers = {
      Authorization: `Bearer ${JSON.parse(token)}`
    };
  
    this.http.delete<any>(`${CONFIG.apiUrl}/authentification/logout`, { headers }).subscribe({
      next: (response) => {
        // this.toastr.success(response?.message || 'Déconnexion réussie');
        localStorage.removeItem('token');
        localStorage.removeItem('teacher');
        this.router.navigate(['/login_teacher']); // Redirige vers la page de login
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
        this.toastr.error(err?.error?.message || 'Erreur lors de la déconnexion');
      }
    });
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) { // Vérifie si nous sommes dans un navigateur
      const tokenString = localStorage.getItem('token');  // Récupère le token depuis localStorage
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);  // Parser le token si c'est une chaîne JSON
          return !!token?.access_token;  // Vérifie si un `access_token` existe
        } catch (e) {
          console.error('Erreur lors du parsing du token:', e);
          return false;  // En cas d'erreur de parsing, l'utilisateur n'est pas authentifié
        }
      }
    }
    return false;  // Si aucun token n'existe, l'utilisateur n'est pas authentifié
  }


}
