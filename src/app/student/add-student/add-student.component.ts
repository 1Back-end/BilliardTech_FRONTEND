import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {AcademicYear} from '../../group/interface/academic_years'
import {Speciality} from '../../group/interface/speciality';
import {Department} from '../../group/interface/Department';
import {Classes} from '../../group/interface/Class';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-student',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,AngularMultiSelectModule,SelectDropDownModule],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {
  ServiceForm: FormGroup;
  academic_years: AcademicYear[] = [];
  speciality: Speciality[] = [];
  departments: Department[] = [];
  classes: Classes[] = [];
  selectedAcademicYear: any;
  avatar_uuid: string | null = null;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;

 
  dropdownSettings = {};
  specialityDropdownSettings = {};
  DepartmentDropdownSettings = {};
  ClassDropdownSettings = {};
  
  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient,private router: Router) {
    this.ServiceForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      storage_uuid: [null], // Champ optionnel
      program_uuid: ['', Validators.required],
      speciality_uuid: ['', Validators.required],
      academic_year_uuid: ['', Validators.required],
      group_uuid : ['',Validators.required]
    });
    
    
  }
  

  ngOnInit(): void {
    this.LoadAcademicYear();
    this.LoadSpeciality();
    this.LoadAcademicYear();
    this.LoadDepartment();
    this.LoadClass();
  
    this.specialityDropdownSettings = {
      singleSelection: true,
      text: "Sélectionner la spécialité",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
    this.dropdownSettings = {
      singleSelection: true,
      text: "Sélectionner l'année scolaire",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
    this.DepartmentDropdownSettings = {
      singleSelection: true,
      text: "Sélectionner une filière",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
    this.ClassDropdownSettings = {
      singleSelection: true,
      text: "Sélectionner une classe",
      enableSearchFilter: true,
      labelKey: "name",
      primaryKey: "uuid",
      showCheckbox: true
    };
  }

  LoadDepartment(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/programs/get_all`).subscribe(
      (response) => {
        this.departments = response;
        // console.log(response)
      },
      (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
      }
    );
  }

  LoadClass(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/class/get_all`).subscribe(
      (response) => {
        this.classes = response;
        // console.log(response)
      },
      (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
      }
    );
  }
  LoadAcademicYear(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/academic_year/get_uuid_and_name_academic_year`).subscribe(
      (response) => {
        this.academic_years = response.map((item: any) => ({
          uuid: item.uuid,
          name: item.name
        }));
      },
      (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
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
        this.toastr.error(message);
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Générer un aperçu de l’image
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.filePreview = null;
    this.ServiceForm.get('storage_uuid')?.setValue("1");
  }

  onSubmit(): void {
    if (this.ServiceForm.invalid) {
      this.toastr.error('Tous les champs requis ne sont pas remplis');
      return;
    }
  
    const formData = this.ServiceForm.value;
  
    const serviceData: any = {
      ...formData,
      academic_year_uuid: formData.academic_year_uuid?.[0]?.uuid || '',
      speciality_uuid: formData.speciality_uuid?.[0]?.uuid || '',
      program_uuid: formData.program_uuid?.[0]?.uuid || '',
      group_uuid: formData.group_uuid?.[0]?.uuid || '',
      storage_uuid: null
    };
  
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
  
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
  
      console.log("Uploading image...");
  
      this.http.post<any>(`${CONFIG.apiUrl}/storages/upload`, uploadForm).subscribe({
        next: (uploadResponse) => {
          const storage_uuid = uploadResponse?.uuid; // 👈 correction ici
          if (storage_uuid) {
            serviceData.storage_uuid = storage_uuid;
            this.toastr.success("Image téléchargée avec succès.");
          } else {
            this.toastr.warning("UUID manquant. Enregistrement sans image.");
          }

  
          this.createStudent(serviceData);
        },
        error: (err) => {
          console.error("Erreur upload image:", err);
          this.toastr.error("Erreur lors du téléchargement de l'image.");
          // Tu peux commenter la ligne suivante si tu veux stopper tout si l’image échoue
          this.createStudent(serviceData);
        }
      });
    } else {
      // Pas d'image : envoyer directement
      this.createStudent(serviceData);
    }
  }
  
  createStudent(data: any): void {
    this.http.post<any>(`${CONFIG.apiUrl}/students/create`, data).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/students']);
        this.toastr.success(response.message || 'Enregistrement effectué avec succès');
        this.ServiceForm.reset();
      },
      error: (error) => {
        const message = error?.error?.detail || "Erreur lors de l'enregistrement";
        this.toastr.error(message);
      }
    });
  }
  
}
  