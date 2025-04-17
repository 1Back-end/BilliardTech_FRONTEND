import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../config';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements OnInit {
users: any[] = [];
isLoading: boolean = false;
currentPage: number = 1;
totalPages: number = 0;
titlesPerPage: number = 25;
searchQuery: string = '';
exportUrl: string = '';
totalItems: number = 0;
direction: { [key: string]: 'asc' | 'desc' } = {}; // pour le tri par colonne

constructor(private http: HttpClient, private toastr: ToastrService) {}

ngOnInit(): void {
  this.getAllServices(); // Charger les utilisateurs au démarrage
}


getAllServices(): void {
  this.isLoading = true;

  const params = new HttpParams()
    .set('page', this.currentPage.toString())
    .set('per_page', this.titlesPerPage.toString());

  this.http.get<any>(`${CONFIG.apiUrl}/users/get_many`, { params }).subscribe(
    (response) => {
      this.users = response.data;
      this.currentPage = response.current_page;
      this.totalPages = response.pages; // ✅ Correspond à "pages" dans ta réponse
      this.totalItems = response.total;
      this.isLoading = false;
    },
    (error) => {
      this.toastr.error('Erreur lors du chargement des utilisateurs');
      this.isLoading = false;
    }
  );
}

goToPage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.getAllServices();
}


    sortBy(column: string): void {
      // Toggle sort direction
      this.direction[column] = this.direction[column] === 'asc' ? 'desc' : 'asc';

      // Perform sorting on the fournisseurs array
      this.users.sort((a: any, b: any) => {
        const valA = a[column] || '';
        const valB = b[column] || '';
        
        // Sort in ascending or descending order based on direction
        return this.direction[column] === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }
  updateStatus(userUuid: string, status: string): void {
    this.isLoading = true;
  
    const url = `${CONFIG.apiUrl}/users/update-status`;
  
    // Crée un objet avec uuid et status
    const requestData = {
      uuid: userUuid,
      status: status
    };
  
    // Appel PUT pour envoyer les données dans le corps de la requête
    this.http.put<any>(url, requestData).subscribe(
      (response) => {
        this.toastr.success(response?.message || 'Statut mis à jour avec succès');
        this.getAllServices();  // Rafraîchir la liste des utilisateurs
        this.isLoading = false;
      },
      (error) => {
        console.log('Erreur :', error);  // Affiche l'objet d'erreur dans la console pour inspection
        const errorMessage = error?.error?.message || 'Erreur lors de la mise à jour du statut';
        this.toastr.error(errorMessage, error?.message || 'Erreur inconnue');
        this.isLoading = false;
      }
    );
  }
  deleteUser(uuid: string): void {
    const url = `${CONFIG.apiUrl}/users/delete-user`;
    const ResquestData = {
        uuid: uuid
    };
    this.http.put<any>(url,ResquestData).subscribe(
      (response) => {
        // Message depuis la réponse backend
        this.toastr.success(response.message || 'Utilisateur supprimé avec succès');
        this.getAllServices(); // Actualise la liste après la suppression
      },
      (error) => {
        // Message d'erreur depuis le backend
        const errorMessage = error?.error?.message || 'Erreur lors de la suppression de l\'utilisateur';
        this.toastr.error(errorMessage);
      }
    );
  }
  
  
  
}
