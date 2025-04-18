import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (typeof window !== 'undefined') { // Vérifie si l'environnement est bien côté client
    const tokenString = localStorage.getItem('token');  // Récupère le token depuis localStorage

    if (tokenString) {
      try {
        const token = JSON.parse(tokenString);  // Parser la chaîne JSON pour obtenir l'objet du token

        // Si le token existe et contient un access_token
        if (token && token.access_token) {
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token.access_token}`, // Ajoute le token dans l'en-tête de la requête
            }
          });

          // Renvoie la requête modifiée avec l'en-tête Authorization
          return next(clonedReq);
        }
      } catch (error) {
        console.error('Error parsing token:', error); // Gestion de l'erreur si le token est mal formé
      }
    }
  }

  // Si le token n'est pas trouvé, mal formé, ou ce n'est pas un environnement client, envoie la requête sans modification
  return next(req);
};
