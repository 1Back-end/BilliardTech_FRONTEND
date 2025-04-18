import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient,HttpHeaders  ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../config';
import { FormsModule } from '@angular/forms'; 
import {RoleService } from '../services/role.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import {LanguageHeaderService} from '../admin/language-header.service';
@Component({
  selector: 'app-academic-year',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,TranslateModule],
  templateUrl: './academic-year.component.html',
  styleUrl: './academic-year.component.css'
})
export class AcademicYearComponent implements OnInit {

  services: any[] = [];
  serviceId: string | null = null;
  ServiceForm: FormGroup;
  selectedService: any = null;
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 5;
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {};


  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,public role: RoleService,private translate: TranslateService,private languageHeaderService: LanguageHeaderService,) {
    this.ServiceForm = this.fb.group({
      name: ['', Validators.required],
      start_date : ['',Validators.required],
      end_date : ['',Validators.required],
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
  
      this.http.get<any>(`${CONFIG.apiUrl}/academic_year/get_many`, { params }).subscribe(
        (response) => {
          this.services = response.data;
          this.currentPage = response.current_page;
          this.totalPages = response.pages;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        (error) => {
          this.toastr.error('Erreur lors du chargement des voix');
          this.isLoading = false;
        }
      );
    }
    onItemsPerPageChange(): void {
      this.currentPage = 1; // Réinitialiser à la première page
      this.getAllServices(); // Recharger les services avec le nouveau nombre d'éléments par page
    }
  
    goToPage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.getAllServices();
    }
  

  // Récupérer la liste des services
  
  sortBy(column: string): void {
    this.direction[column] = this.direction[column] === 'asc' ? 'desc' : 'asc';

    this.services.sort((a: any, b: any) => {
      const valA = a[column] || '';
      const valB = b[column] || '';
      return this.direction[column] === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }

  // Soumettre le formulaire pour créer ou modifier un service
  async onSubmit(): Promise<void> {
    if (this.ServiceForm.invalid) {
      this.toastr.error('Tous les champs sont requis');
      return;
    }
    if (this.selectedService) {
      await this.updateService(); // Mise à jour si un service est sélectionné
    } else {
      await this.addService(); // Création d'un nouveau service
    }
  }

  // Ajouter un service
  async addService(): Promise<void> {
    const serviceData = this.ServiceForm.value;
    const headers = this.languageHeaderService.getLanguageHeader();
    this.http.post(`${CONFIG.apiUrl}/academic_year/create`, serviceData,{ headers }).subscribe(
      (response: any) => {
        this.toastr.success(response?.message || 'Enregistrement effectué avec succès');
        this.resetForm(); 
        // Recharge directement la liste complète
        this.getAllServices();
      },
      (error: any) => {
        const message = error?.error?.message || error?.error?.detail || "Erreur lors de l'enregistrement.";
        this.toastr.error(message);
        console.error("Erreur lors de l'enregistrement :", error);
      }
    );
  }
  
  
  async updateService(): Promise<void> {
    const serviceData = {
      ...this.ServiceForm.value,
      uuid: this.selectedService.uuid, // uuid ajouté dans le corps
    };
    const currentLang = this.translate.currentLang || 'fr';  // Utilise ngx-translate ou un autre mécanisme pour obtenir la langue active.
    // Ajouter l'en-tête Accept-Language
    const headers = new HttpHeaders().set('Accept-Language', currentLang);
  
    this.http.put(`${CONFIG.apiUrl}/academic_year/update`, serviceData,{ headers }).subscribe(
      (response: any) => {
        const index = this.services.findIndex(service => service.uuid === this.selectedService.uuid);
        if (index !== -1) this.services[index] = response.data;
        this.toastr.success(response?.message || 'Modification effectuée avec succès');
        this.resetForm();
        this.getAllServices();
      },
      (error) => {
        const msg = error?.error?.detail || 'Erreur lors de la modification';
        this.toastr.error(msg);
        console.error('Erreur de mise à jour :', error);
      }
    );
  }
  // Éditer un service existant
  editService(service: any): void {
    this.selectedService = service;
    this.ServiceForm.patchValue({
      name: service.name,
      start_date: service.start_date,
      end_date: service.end_date,
    });
  }
  

    // Supprimer un service
    deleteService(uuid: string): void {
      const body = { uuid };
      const currentLang = this.translate.currentLang || 'fr';  // Utilise ngx-translate ou un autre mécanisme pour obtenir la langue active.
    // Ajouter l'en-tête Accept-Language
      const headers = new HttpHeaders().set('Accept-Language', currentLang);
      this.http.put<any>(`${CONFIG.apiUrl}/academic_year/delete-academic-year`, body,{headers})
        .subscribe(
          (response) => {
            this.toastr.success(response?.message || 'Suppression effectuée avec succès');
            this.getAllServices();
          },
          (error) => {
            const message = error?.error?.detail || 'Ce service ne peut pas être supprimé car il est associé à des éléments liés.';
            this.toastr.error(message);
            console.error('Erreur lors de la suppression :', error);
          }
        );
    }

    updateStatus(uuid: string, status: string): void {
      const body = { uuid, status };   
      this.http.put<any>(`${CONFIG.apiUrl}/academic_year/update-status-academic-year`, body).subscribe(
        (response) => {
          this.toastr.success(response.message || 'Statut mis à jour avec succès');
          this.getAllServices(); // Rafraîchir la liste
        },
        (error) => {
          console.error('Erreur :', error);
          const errorMessage = error?.error?.detail || 'Erreur lors de la mise à jour du statut';
          this.toastr.error(errorMessage);
        }
      );
    }
    
  

  // Pagination


  // Réinitialiser le formulaire
  resetForm(): void {
    this.selectedService = null;
    this.ServiceForm.reset();
  }



}
