import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') { // Vérifie si l'environnement est côté client
      const tokenString = localStorage.getItem('token');  // Récupère le token depuis localStorage
      
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);  // Parser la chaîne JSON pour obtenir l'objet

          // Si le `access_token` n'est pas présent ou est invalide
          if (!token || !token.access_token) { 
            this.router.navigate(['/login']);  // Redirige vers la page de connexion
            return false;
          }
        } catch (error) {
          console.error('Error parsing token:', error);
          this.router.navigate(['/login']);  // Si le token est mal formé, redirige vers la page de connexion
          return false;
        }
      } else {
        this.router.navigate(['/login']);  // Si aucun token n'est trouvé, redirige vers la page de connexion
        return false;
      }
    }

    return true; // Si tout est OK, l'utilisateur peut accéder à la page
  }
}
