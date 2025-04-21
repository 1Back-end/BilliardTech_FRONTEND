import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {AcademicYear} from '../../group/interface/academic_years'
import {Speciality} from '../../group/interface/speciality';
import {Department} from '../../group/interface/Department';
import {Classes} from '../../group/interface/Class';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { firstValueFrom } from 'rxjs';
import {LanguageHeaderService} from '../../admin/language-header.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink, FormsModule,TranslateModule,AngularMultiSelectModule,SelectDropDownModule],
  templateUrl: './edit-courses.component.html',
  styleUrl: './edit-courses.component.css'
})
export class EditCoursesComponent implements OnInit {

  speciality: Speciality[] = [];
  departments: Department[] = [];
  classes: Classes[] = [];
  selectedAcademicYear: any;
  academic_years: AcademicYear[] = [];
  ServiceForm: FormGroup;

  dropdownSettings = {};
  specialityDropdownSettings = {};
  DepartmentDropdownSettings = {};
  ClassDropdownSettings = {};
  uuid: string = '';

  constructor(private toastr: ToastrService, private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient,private router: Router,private languageHeaderService: LanguageHeaderService) {
    this.ServiceForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      credits: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      type: ['', Validators.required],
      speciality_uuid: ['', Validators.required],
      group_uuid: ['', Validators.required],
      academic_year_uuid: ['', Validators.required]
    });
    
    
  }
  getCourses(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/courses/get_by_uuid?uuid=${this.uuid}`).subscribe(
      (data) => {
        console.log('Données reçues :', data);
  
        this.ServiceForm.patchValue({
          code : data.code || '',
          title : data.title || '',
          credits : data.credits || '',
          type : data.type || '',
          academic_year_uuid: data.academic_year ? [data.academic_year] : [],
          group_uuid: data.group ? [data.group] : [],
          speciality_uuid: data.speciality ? [data.speciality] : [],
         
        });
      },
      (error) => {
        this.toastr.error('Impossible de charger les données');
      }
    );
  }

  ngOnInit(): void {
    this.LoadAcademicYear();
    this.LoadSpeciality();
    this.LoadAcademicYear();
    this.LoadDepartment();
    this.LoadClass();
    this.uuid = this.route.snapshot.params['uuid'];
    this.getCourses();
  
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
      group_uuid: formData.group_uuid?.[0]?.uuid || '',
      uuid: this.uuid,
    };
    this.updateCourses(serviceData);
  }
  
  updateCourses(data: any): void {
    const headers = this.languageHeaderService.getLanguageHeader();
    this.http.put<any>(`${CONFIG.apiUrl}/courses/update`, data,{headers}).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/courses']);
        this.toastr.success(response.message);
        this.ServiceForm.reset();
      },
      error: (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
      }
    });
  }

}
