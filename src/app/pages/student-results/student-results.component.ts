import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { RoleService } from '../../services/role.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageHeaderService } from '../../admin/language-header.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgbAccordionModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';  // Correct imports

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    TranslateModule, 
    NgbAccordionModule, 
    AngularMultiSelectModule
  ],
  templateUrl: './student-results.component.html',
  styleUrls: ['./student-results.component.css']  // Corrected 'styleUrl' to 'styleUrls'
})
export class StudentResultsComponent implements OnInit {
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {};
  services: any[] = [];

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private http: HttpClient,
    public role: RoleService,
    private translate: TranslateService,
    private languageHeaderService: LanguageHeaderService
  ) {}
  
  ngOnInit(): void {
    this.getAllServices();
  }
  
  getAllServices(): void {
    this.isLoading = true;
    
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
  
    this.http.get<any>(`${CONFIG.apiUrl}/notes/student-report`, { params }).subscribe(
      (response) => {
        this.services = response.data;
        this.currentPage = response.current_page;
        this.totalPages = response.pages;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      (error) => {
        const message = error?.error?.message || error?.error?.detail;
        this.toastr.error(message);
        this.isLoading = false;
      }
    );
  }
  onClassChange(): void {
    this.currentPage = 1;
    this.getAllServices();
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

}
