import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../config';
import { FormsModule } from '@angular/forms'; 
import { TranslateModule } from '@ngx-translate/core';
import {LanguageHeaderService} from '../admin/language-header.service';
@Component({
  selector: 'app-profesors',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule,TranslateModule],
  templateUrl: './profesors.component.html',
  styleUrl: './profesors.component.css'
})
export class ProfesorsComponent implements OnInit  {
  academic_years : any[] = [];
  services: any[] = [];
  serviceId: string | null = null;
  ServiceForm: FormGroup;
  selectedService: any = null;
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {};


  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,private languageHeaderService: LanguageHeaderService,) {
    this.ServiceForm = this.fb.group({
      name: ['', Validators.required],
      code : ['',Validators.required],
      program_uuid : ['',Validators.required],
      academic_year_uuid  : ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllServices();
  }
  getAllServices(): void {
      this.isLoading = true;
      const params = new HttpParams()
        .set('page', this.currentPage.toString())
        .set('per_page', this.titlesPerPage.toString());
  
      this.http.get<any>(`${CONFIG.apiUrl}/teachers/get_many`, { params }).subscribe(
        (response) => {
          this.services = response.data;
          // console.log(response.data);
          this.currentPage = response.current_page;
          this.totalPages = response.pages;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        (error) => {
          const message = error?.error?.detail;
          this.toastr.error(message);
          this.isLoading = false;
        }
      );
    }
  
    goToPage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.getAllServices();
    }
    onItemsPerPageChange(): void {
      this.currentPage = 1; // Réinitialiser à la première page
      this.getAllServices(); // Recharger les services avec le nouveau nombre d'éléments par page
    }
    sortBy(column: string): void {
      // Toggle sort direction
      this.direction[column] = this.direction[column] === 'asc' ? 'desc' : 'asc';
  
      // Perform sorting on the fournisseurs array
      this.services.sort((a: any, b: any) => {
        const valA = a[column] || '';
        const valB = b[column] || '';
        
        // Sort in ascending or descending order based on direction
        return this.direction[column] === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }
   
    
    deleteService(uuid: string): void {
      const headers = this.languageHeaderService.getLanguageHeader();
      const body = { uuid };
      this.http.put<any>(`${CONFIG.apiUrl}/teachers/delete-teacher`, body,{headers})
        .subscribe(
          (response) => {
            this.toastr.success(response?.message);
            this.getAllServices();
          },
          (error) => {
            const message = error?.error?.detail;
            this.toastr.error(message);
            console.error('Erreur lors de la suppression :', error);
          }
        );
    }
    updateStatus(userUuid: string, status: string): void {
      const headers = this.languageHeaderService.getLanguageHeader();
      this.isLoading = true;
      const url = `${CONFIG.apiUrl}/teachers/update-status`;
      // Crée un objet avec uuid et status
      const requestData = {
        uuid: userUuid,
        status: status
      };
    
      // Appel PUT pour envoyer les données dans le corps de la requête
      this.http.put<any>(url, requestData,{headers}).subscribe(
        (response) => {
          this.toastr.success(response.message);
          this.getAllServices();  // Rafraîchir la liste des utilisateurs
          this.isLoading = false;
        },
        (error) => {
          console.log('Erreur :', error);  // Affiche l'objet d'erreur dans la console pour inspection
          const errorMessage = error?.error?.detail || 'Erreur lors de la mise à jour du statut';
          this.toastr.error(errorMessage, error?.message || 'Erreur inconnue');
          this.isLoading = false;
        }
      );
    }


}
