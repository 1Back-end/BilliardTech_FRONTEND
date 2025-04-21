import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { CONFIG } from '../../config';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageHeaderService } from '../admin/language-header.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbAccordionModule,
  NgbPagination,
  NgbPaginationPages,
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-affectations-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, AngularMultiSelectModule,NgbAccordionModule],
  templateUrl: './affectations-courses.component.html',
  styleUrl: './affectations-courses.component.css'
})
export class AffectationsCoursesComponent implements OnInit {
  teachersList: any[] = [];
  selectedTeachers: any[] = [];

  coursesList: any[] = [];
  selectedCourses: any[] = [];

  multiSelectSettings = {};
  courseMultiSelectSettings = {};
  teachersWithCourses: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {};

  editMode: boolean = false;
  currentAssignmentUuid: string | null = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private languageHeaderService: LanguageHeaderService
  ) {}
  
  loadTeachersWithCourses() {
    this.isLoading = true;
    const params = new HttpParams()
        .set('page', this.currentPage.toString())
        .set('per_page', this.titlesPerPage.toString());
    this.http.get<any>(`${CONFIG.apiUrl}/teachers/teachers-with-courses`, { params })
      .subscribe({
        next: (response) => {
          this.teachersWithCourses = response.data;
          this.currentPage = response.current_page;
          this.totalPages = response.pages;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error("Erreur de chargement des professeurs et de leurs cours.");
          this.isLoading = false;
        }
      });
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadTeachersWithCourses();
  }
  
  onItemsPerPageChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page
    this.loadTeachersWithCourses(); // Recharger les services avec le nouveau nombre d'éléments par page
  }
  
  sortBy(column: string): void {
    // Toggle sort direction
    this.direction[column] = this.direction[column] === 'asc' ? 'desc' : 'asc';
  
    // Perform sorting on the teachers array
    this.teachersWithCourses.sort((a: any, b: any) => {
      const valA = a[column] || '';
      const valB = b[column] || '';
      
      // Sort in ascending or descending order based on direction
      if (this.direction[column] === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });
  }
  
  ngOnInit(): void {
    this.loadTeachers();
    this.loadCourses();
    this.loadTeachersWithCourses();

    this.multiSelectSettings = {
      singleSelection: true,
      text: "Sélectionner un enseignant",
      enableSearchFilter: true,
      labelKey: "full_name",
      primaryKey: "uuid"
    };

    this.courseMultiSelectSettings = {
      singleSelection: false,
      text: "Sélectionner les cours",
      enableSearchFilter: true,
      labelKey: "title",
      primaryKey: "uuid"
    };
  }
 

  loadTeachers() {
    this.http.get<any[]>(`${CONFIG.apiUrl}/teachers/get_all_teachers`)
      .subscribe({
        next: (res) => {
          this.teachersList = res.map(t => ({
            ...t,
            full_name: `${t.first_name} ${t.last_name}`
          }));
        },
        error: () => {
          this.toastr.error("Erreur de chargement des professeurs.");
        }
      });
  }

  loadCourses() {
    this.http.get<any[]>(`${CONFIG.apiUrl}/courses/get_all_courses`)
      .subscribe({
        next: (res) => {
          this.coursesList = res;
        },
        error: () => {
          this.toastr.error("Erreur de chargement des cours.");
        }
      });
  }

  assignCoursesToTeachers() {
    if (!this.selectedTeachers.length || !this.selectedCourses.length) {
      this.toastr.error("Veuillez sélectionner un professeur et au moins un cours.");
      return;
    }
    const payload = {
      teacher_uuid: this.selectedTeachers[0]?.uuid,
      course_uuids: this.selectedCourses.map(c => c.uuid)
    };

    this.http.post(`${CONFIG.apiUrl}/course-assignments/assign-to-teacher`, payload)
      .subscribe({
        next: (response:any) => {
          this.toastr.success(response.message);
          this.selectedTeachers = [];
          this.selectedCourses = [];
        },
        error: (error:any) => {
          const message = error?.error?.detail;
          this.toastr.error(message);
        }
      });
  }
  openEditModal(teacher: any) {
    this.editMode = true;
    this.currentAssignmentUuid = teacher.uuid;
  
    // Pré-remplir le professeur
    this.selectedTeachers = this.teachersList.filter(t => t.uuid === teacher.teacher.uuid);
  
    // Pré-remplir les cours (en single selection ici, mais adapter si nécessaire)
    this.selectedCourses = this.coursesList.filter(course =>
      teacher.courses.some((c: any) => c.uuid === course.uuid)
    );
  
    // Ouvrir la modale
    const modal = new (window as any).bootstrap.Modal(document.getElementById('assignTeacherModal'));
    modal.show();
  }
  
}