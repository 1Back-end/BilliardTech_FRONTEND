import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // Importation nécessaire

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Injection de PLATFORM_ID
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) { // Vérification si nous sommes dans un navigateur
      const tokenString = localStorage.getItem('token');  // Récupère l'objet entier du token depuis localStorage
      
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);  // Parser la chaîne JSON pour obtenir l'objet

          // Vérifie si le token contient un access_token valide
          if (token && token.access_token) {
            // Redirige vers la page admin si l'utilisateur est déjà connecté
            this.router.navigate(['/admin/dashboard']);
            return false;
          }
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    }
  
    return true; // Si le token n'est pas présent ou est invalide, on autorise l'accès
  }
}
