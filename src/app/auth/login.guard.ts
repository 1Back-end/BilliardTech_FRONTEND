import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const tokenUserString = localStorage.getItem('user');
      const tokenTeacherString = localStorage.getItem('token_teacher');

      try {
        if (tokenUserString) {
          const token = JSON.parse(tokenUserString);
          if (token && token.access_token) {
            this.router.navigate(['/admin/dashboard']); // Redirection utilisateur
            return false;
          }
        }

        if (tokenTeacherString) {
          const token = JSON.parse(tokenTeacherString);
          if (token && token.access_token) {
            this.router.navigate(['/teacher/dashboard']); // Redirection enseignant
            return false;
          }
        }
      } catch (error) {
        console.error('Erreur lors du parsing du token :', error);
      }
    }

    return true; // Autorise l'accès si aucun token valide trouvé
  }
}
