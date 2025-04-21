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
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink, FormsModule,TranslateModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
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


  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient) {
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
        .set('per_page', this.titlesPerPage.toString());
  
      this.http.get<any>(`${CONFIG.apiUrl}/courses/get_many`, { params }).subscribe(
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
      const body = { uuid };
      this.http.put<any>(`${CONFIG.apiUrl}/courses/delete`, body)
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
    

}
