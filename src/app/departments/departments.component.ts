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
@Component({
  selector: 'app-departments',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,NgSelectModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  services: any[] = [];
  programs : any[] = [];
  academic_years : any[] = [];
  academicYears: any[] = [];
  serviceId: string | null = null;
  ServiceForm: FormGroup;
  selectedService: any = null;
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 5;
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {};


  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,public role: RoleService, private cdRef: ChangeDetectorRef,) {
    this.ServiceForm = this.fb.group({
      name: ['', Validators.required],
      code : ['',Validators.required],
      program_uuid : ['',Validators.required],
      academic_year_uuid  : ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllServices();
    this.LoadAcademicYear();
    this.LoadData();
  }
  LoadAcademicYear(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/academic_year/get_uuid_and_name_academic_year`).subscribe(
      (response) => {
        this.academic_years = response;
        console.log(this.academic_years)
      },
      (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
      }
    );
  }

  LoadData(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/programs/get_all`).subscribe(
      (response) => {
        this.programs = response;
        console.log(this.programs)
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
  
      this.http.get<any>(`${CONFIG.apiUrl}/speciality/get_many`, { params }).subscribe(
        (response) => {
          this.services = response.data;
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
  
    this.http.post(`${CONFIG.apiUrl}/speciality/create`, serviceData).subscribe(
      (response: any) => {
        this.toastr.success(response?.message);
        this.resetForm(); 
        // Recharge directement la liste complète
        this.getAllServices();
      },
      (error: any) => {
        const message = error?.error?.detail;
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
  
    this.http.put(`${CONFIG.apiUrl}/speciality/update`, serviceData).subscribe(
      (response: any) => {
        const index = this.services.findIndex(service => service.uuid === this.selectedService.uuid);
        if (index !== -1) this.services[index] = response.data;
        this.toastr.success(response?.message);
        this.resetForm();
        this.getAllServices();
      },
      (error) => {
        const msg = error?.error?.detail;
        this.toastr.error(msg);
        console.error('Erreur de mise à jour :', error);
      }
    );
  }
  editService(service: any): void {
    this.selectedService = service;
    this.ServiceForm.patchValue({
      program_uuid: service.program?.uuid,
      academic_year_uuid: service.academic_year?.uuid,
      name: service.name,
      code : service.code
    });
  }

    // Supprimer un service
    deleteService(uuid: string): void {
      const body = { uuid };
      this.http.put<any>(`${CONFIG.apiUrl}/speciality/delete`, body)
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
