import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../config';
import { FormsModule } from '@angular/forms'; 
import {RoleService } from '../services/role.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import {AcademicYear} from '../group/interface/academic_years';
import { TranslateModule } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import {LanguageHeaderService} from '../admin/language-header.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
@Component({
  selector: 'app-semester',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgSelectModule,SelectDropDownModule,TranslateModule,AngularMultiSelectModule],
  templateUrl: './semester.component.html',
  styleUrl: './semester.component.css'
})
export class SemesterComponent implements OnInit {
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

  academic_years: AcademicYear[] = [];
  dropdownSettings = {};

  
  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,public role: RoleService, private cdRef: ChangeDetectorRef,) {
    this.ServiceForm = this.fb.group({
      name: ['', Validators.required],
      start_date : ['',Validators.required],
      end_date : ['',Validators.required],
      academic_year_uuid : ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllServices();
    // this.LoadAcademicYear();
    this.LoadData();
    this.dropdownSettings = {
      singleSelection: true,
      text: "Sélectionner l'année scolaire",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
  }

  
  LoadAcademicYear(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/academic_year/get_uuid_and_name_academic_year`).subscribe(
      (response) => {
        this.academic_years = response;
      },
      (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message || "Erreur lors du chargement des années académiques");
      }
    );
  }

  LoadData(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/academic_year/get_uuid_and_name_academic_year`).subscribe(
      (response) => {
        this.academic_years = response;
        console.log(this.academic_years)
      },
      (error) => {
        this.toastr.error('Erreur lors du chargement des assureurs');
        console.error(error);
      }
    );
  }

  getAllServices(): void {
      this.isLoading = true;
      const params = new HttpParams()
        .set('page', this.currentPage.toString())
        .set('limit', this.titlesPerPage.toString());
  
      this.http.get<any>(`${CONFIG.apiUrl}/semester/get_many`, { params }).subscribe(
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
  
    this.http.post(`${CONFIG.apiUrl}/semester/create`, serviceData).subscribe(
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
  
    this.http.put(`${CONFIG.apiUrl}/semester/update`, serviceData).subscribe(
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
  editService(service: any): void {
    this.selectedService = service;
  
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
  
    // Assurez-vous que academic_years est déjà chargé avant de patcher
    this.ServiceForm.patchValue({
      academic_year_uuid: service.academic_year?.uuid,
      name: service.name,
      start_date: formatDate(service.start_date),
      end_date: formatDate(service.end_date)
    });
    
    // Forcer la détection de changements si nécessaire
    this.cdRef.detectChanges();
  }

    // Supprimer un service
    deleteService(uuid: string): void {
      const body = { uuid };
      this.http.put<any>(`${CONFIG.apiUrl}/semester/delete`, body)
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
      this.http.put<any>(`${CONFIG.apiUrl}/semester/update-status-semester`, body).subscribe(
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
