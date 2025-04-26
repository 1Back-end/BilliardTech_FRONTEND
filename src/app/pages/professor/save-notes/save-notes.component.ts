import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { CONFIG } from '../../../../config';
import { RoleService } from '../../../services/role.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageHeaderService } from '../../../admin/language-header.service';

@Component({
  selector: 'app-save-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './save-notes.component.html',
  styleUrls: ['./save-notes.component.css']
})
export class SaveNotesComponent implements OnInit {
  semester: any[] = [];
  teacherClasses: any[] = [];
  courses: any[] = [];
  students: any[] = [];
  
  selectedGroupUuid: string = '';
  selectedCourseUuid: string = '';
  selectedSemesterUuid: string = '';

  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  titlesPerPage: number = 25;
  totalItems: number = 0;
  direction: { [key: string]: 'asc' | 'desc' } = {};
  services: any[] = [];
  isEditMode: boolean = false;
  
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private http: HttpClient,
    public role: RoleService,
    private translate: TranslateService,
    private languageHeaderService: LanguageHeaderService
  ) {}
  
  ngOnInit(): void {
    this.loadSemester();
    this.loadTeacherClasses();
    this.getAllServices();
  }
  
  getAllServices(): void {
    this.isLoading = true;
    
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.titlesPerPage.toString());
  
    if (this.selectedGroupUuid) {
      params = params.set('group_uuid', this.selectedGroupUuid);
    }
  
    this.http.get<any>(`${CONFIG.apiUrl}/notes/get_many`, { params }).subscribe(
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

  loadSemester(): void {
    this.http.get<any[]>(`${CONFIG.apiUrl}/semester/get_uuid_and_name_semester`).subscribe(
      (response) => {
        this.semester = response;
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors du chargement des semestres.';
        this.toastr.error(message);
      }
    );
  }
  
  loadTeacherClasses(): void {
    this.http.get<any[]>(`${CONFIG.apiUrl}/teachers/teacher/classes`).subscribe(
      (response) => {
        this.teacherClasses = response;
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors du chargement des classes.';
        this.toastr.error(message);
      }
    );
  }
  loadCoursesByGroup(group_uuid: string): void {
    if (!group_uuid || !this.selectedSemesterUuid) return;
  
    this.http.get<any[]>(`${CONFIG.apiUrl}/notes/group/${group_uuid}/courses`, {
      params: { semester_uuid: this.selectedSemesterUuid }
    }).subscribe(
      (response) => {
        this.courses = response;
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors du chargement des cours.';
        this.toastr.error(message);
      }
    );
  }
  
  loadStudentsByGroup(group_uuid: string): void {
    this.http.get<any[]>(`${CONFIG.apiUrl}/notes/group/${group_uuid}`).subscribe(
      (response) => {
        this.students = response;
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors du chargement des étudiants.';
        this.toastr.error(message);
      }
    );
  }
  
  onClassOrSemesterChange(): void {
    if (this.selectedGroupUuid && this.selectedSemesterUuid) {
      this.loadCoursesByGroup(this.selectedGroupUuid);
      this.loadStudentsByGroup(this.selectedGroupUuid);
    } else if (this.selectedGroupUuid) {
      this.loadStudentsByGroup(this.selectedGroupUuid);
      this.courses = []; // réinitialiser les cours si semestre pas encore choisi
    }
  }
  
  resetForm(): void {
    this.courses = [];
    this.students = [];
    this.selectedGroupUuid = '';
    this.selectedCourseUuid = '';
    this.selectedSemesterUuid = '';
  }
  

  onSaveNotes(): void {
    // Vérification de la présence des informations nécessaires
    console.log('Group UUID:', this.selectedGroupUuid);
    console.log('Course UUID:', this.selectedCourseUuid);
    console.log('Semester UUID:', this.selectedSemesterUuid);
    console.log('Students:', this.students);
  
    if (!this.selectedGroupUuid || !this.selectedCourseUuid || !this.selectedSemesterUuid || !this.students.length) {
      this.toastr.error('Veuillez sélectionner une classe, un semestre, un cours et des étudiants avant d\'enregistrer.');
      return;
    }
  
    // Préparer les notes des étudiants
    const notesData = this.students.map(student => ({
      student_uuid: student.uuid,
      note_cc: student.exam_type === 'note_cc' ? student.grade : null,  // Prendre null si non applicable
      note_sn: student.exam_type === 'note_sn' ? student.grade : null   // Prendre null si non applicable
    }));
    
  
    // Préparer l'objet complet à envoyer
    const payload = {
      course_uuid: this.selectedCourseUuid,
      semester_uuid: this.selectedSemesterUuid,
      notes: notesData
    };
  
    this.http.post(`${CONFIG.apiUrl}/notes/exam-notes/bulk`, payload).subscribe(
      (response: any) => {
        const message = response?.message || 'Les notes ont été enregistrées avec succès.';
        this.toastr.success(message);  // Afficher le message dans la notification
        this.resetForm();  // Réinitialiser après la sauvegarde
      },
      (error) => {
        const message = error?.error?.detail || 'Erreur lors de l\'enregistrement des notes.';
        this.toastr.error(message);
      }
    );
  }
  onEdit(service: any): void {
    this.isEditMode = true;
    // Pré-remplir les champs selon le service sélectionné
    this.selectedGroupUuid = service.group_uuid;
    this.selectedSemesterUuid = service.semester_uuid;
    this.selectedCourseUuid = service.course_uuid;
  
    // Charger les cours et étudiants liés
    this.onClassOrSemesterChange();
  
    // Charger les notes déjà saisies pour les étudiants
    this.students = service.students.map((s: any) => ({
      matricule: s.matricule,
      exam_type: s.exam_type,
      grade: s.grade
    }));
  }
}
