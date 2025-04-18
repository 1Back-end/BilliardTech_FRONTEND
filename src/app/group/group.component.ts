import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../config';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {AcademicYear} from './interface/academic_years'; 
import {Speciality} from './interface/speciality';
import { TranslateModule } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import {LanguageHeaderService} from '../admin/language-header.service';
@Component({
  selector: 'app-group',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,AngularMultiSelectModule,TranslateModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Ajoute cette ligne ici
})
export class GroupComponent implements OnInit {
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
  speciality: Speciality[] = [];
  
  dropdownSettings = {};
  specialityDropdownSettings = {};
  
  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient) {
    this.ServiceForm = this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
      academic_year_uuid: ['', Validators.required],
      speciality_uuid: ['', Validators.required], // 👈 Nouveau champ pour la spécialité
    });
  }
  
  ngOnInit(): void {
    this.getAllServices();
    this.LoadAcademicYear();
    this.LoadSpeciality();
  
    this.dropdownSettings = {
      singleSelection: true,
      text: "Sélectionner l'année scolaire",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
  
    this.specialityDropdownSettings = {
      singleSelection: true,
      text: "Sélectionner la spécialité",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
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
  getAllServices(): void {
    this.isLoading = true;
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
  
    this.http.get<any>(`${CONFIG.apiUrl}/class/get_many`, { params }).subscribe(
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
  
  LoadSpeciality(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/speciality/get_uuid_and_name_department`).subscribe(
      (response) => {
        this.speciality = response;
      },
      (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message || "Erreur lors du chargement des spécialités");
      }
    );
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
    const formData = this.ServiceForm.value;
  
    const serviceData = {
      ...formData,
      academic_year_uuid: formData.academic_year_uuid[0]?.uuid || '', // 👈 extraire l'UUID
      speciality_uuid: formData.speciality_uuid[0]?.uuid || '',       // 👈 idem
    };
  
    this.http.post(`${CONFIG.apiUrl}/class/create`, serviceData).subscribe(
      (response: any) => {
        this.toastr.success(response?.message);
        this.resetForm(); 
        this.getAllServices(); // Recharge directement la liste complète
      },
      (error: any) => {
        const message = error?.error?.detail;
        this.toastr.error(message || 'Erreur lors de l\'enregistrement');
        console.error("Erreur lors de l'enregistrement :", error);
      }
    );
  }
  
  
  
  async updateService(): Promise<void> {
    const formData = this.ServiceForm.value;
  
    const serviceData = {
      ...formData,
      uuid: this.selectedService.uuid,
      academic_year_uuid: formData.academic_year_uuid[0]?.uuid || '',
      speciality_uuid: formData.speciality_uuid[0]?.uuid || '',
    };
  
    this.http.put(`${CONFIG.apiUrl}/class/update`, serviceData).subscribe(
      (response: any) => {
        const index = this.services.findIndex(service => service.uuid === this.selectedService.uuid);
        if (index !== -1) this.services[index] = response.data;
        this.toastr.success(response?.message);
        this.resetForm();
        this.getAllServices();
      },
      (error) => {
        const msg = error?.error?.detail;
        this.toastr.error(msg || 'Erreur de mise à jour');
        console.error('Erreur de mise à jour :', error);
      }
    );
  }
  editService(service: any): void {
    this.selectedService = service;
  
    this.ServiceForm.patchValue({
      name: service.name,
      level: service.level,
      // On met les objets dans des tableaux pour angular2-multiselect
    academic_year_uuid: service.academic_year ? [service.academic_year] : [],
    speciality_uuid: service.speciality ? [service.speciality] : []
    });
  }
  
  
    // Supprimer un service
    deleteService(uuid: string): void {
      const body = { uuid };
      this.http.put<any>(`${CONFIG.apiUrl}/class/delete`, body)
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

   

  // Réinitialiser le formulaire
  resetForm(): void {
    this.selectedService = null;
    this.ServiceForm.reset();
  }





}
