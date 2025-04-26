import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import {LanguageHeaderService} from '../../admin/language-header.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-professeurs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIntlTelInputModule
  ],
  templateUrl: './add-professeurs.component.html',
  styleUrl: './add-professeurs.component.css'
})
export class AddProfesseursComponent {

  UserForm: FormGroup;
  filePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private languageHeaderService: LanguageHeaderService
  ) {
    this.UserForm = this.fb.group({
      last_name : ['', Validators.required],
      first_name : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      address : ['', Validators.required],
      grade : ['', Validators.required],
      login : ['', Validators.required],
      phone_number : ['', [Validators.required, Validators.pattern(/^\+237[6-9]{1}[0-9]{8}$/)]],
      second_phone_number : ['', [Validators.required, Validators.pattern(/^\+237[6-9]{1}[0-9]{8}$/)]],
      avatar_uuid : [null]
    });
    
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
  }
  async onSubmit(): Promise<void> {
    if (this.UserForm.invalid) {
      this.toastr.error('Tous les champs sont requis et doivent être valides.');
      return;
    }
  
    const formData = { ...this.UserForm.value,avatar_uuid: null };

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
  
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
  
      console.log("Uploading image...");
  
      this.http.post<any>(`${CONFIG.apiUrl}/storages/upload`, uploadForm).subscribe({
        next: (uploadResponse) => {
          const avatar_uuid = uploadResponse?.uuid; // 👈 correction ici
          if (avatar_uuid) {
            formData.avatar_uuid = avatar_uuid;
            this.toastr.success("Image téléchargée avec succès.");
          } else {
            this.toastr.warning("UUID manquant. Enregistrement sans image.");
          }

  
          this.createTeachers(formData);
        },
        error: (err) => {
          console.error("Erreur upload image:", err);
          this.toastr.error("Erreur lors du téléchargement de l'image.");
          // Tu peux commenter la ligne suivante si tu veux stopper tout si l’image échoue
          this.createTeachers(formData);
        }
      });
    } else {
      // Pas d'image : envoyer directement
      this.createTeachers(formData);
    }
    
  
    
  }
  
  createTeachers(data: any): void {
    const headers = this.languageHeaderService.getLanguageHeader();
    this.http.post<any>(`${CONFIG.apiUrl}/teachers/create`, data,{headers}).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/profesors']);
        this.toastr.success(response.message);
        this.UserForm.reset();
      },
      error: (error) => {
        const message = error?.error?.detail;
        this.toastr.error(message);
      }
    });
  }

}
