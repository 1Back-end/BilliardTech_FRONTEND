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
export class AuthService {
 
  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object, 
    private router: Router,
    private toastr: ToastrService,
    private languageHeaderService: LanguageHeaderService,
  ) {}

  login(email: string, password: string): Observable<any> {
    const headers = this.languageHeaderService.getLanguageHeader();
    return this.http.post<any>(`${CONFIG.apiUrl}/authentification/login/administrator`, { email, password },{headers}).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem('user', btoa(JSON.stringify(response.user)));
        }
      }),
      catchError(error => {
        // Ne renvoie pas un message générique ici
        return throwError(() => error); // Laisse le message original du backend passer
      })
    );
  }
  
  logout(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const headers = {
      Authorization: `Bearer ${JSON.parse(token)}`
    };
  
    this.http.delete<any>(`${CONFIG.apiUrl}/authentification/logout`, { headers }).subscribe({
      next: (response) => {
        // this.toastr.success(response?.message || 'Déconnexion réussie');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']); // Redirige vers la page de login
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
        this.toastr.error(err?.error?.message || 'Erreur lors de la déconnexion');
      }
    });
  }

  getUserInfo() {
    if (typeof window === 'undefined' || !localStorage.getItem('user')) {
      return { email: '', avatarUrl: 'assets/images/profile_user.png' };
    }
  
    try {
      const userData = localStorage.getItem('user');
      const user = JSON.parse(atob(userData!));
      const avatarUrl = user.avatar?.url || 'assets/images/profile_user.png';
      return { email: user.email, avatarUrl: avatarUrl };
    } catch (error) {
      console.error('Erreur lors du parsing du user :', error);
      return { email: '', avatarUrl: 'assets/images/profile_user.png' };
    }
  }
  
  
  

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) { // Vérifie si nous sommes dans un navigateur
      const tokenString = localStorage.getItem('token');  // Récupère le token depuis localStorage
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);  // Parser le token si c'est une chaîne JSON
          return token?.access_token || null;  // Retourne le `access_token` s'il existe, sinon null
        } catch (e) {
          console.error('Erreur lors du parsing du token:', e);
          return null;  // En cas d'erreur de parsing, retourne null
        }
      }
    }
    return null; // Si nous ne sommes pas dans un environnement client ou pas de token
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
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