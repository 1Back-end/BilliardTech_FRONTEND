import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core'; // Assure-toi que @ngx-translate/core est installé
import {LanguageHeaderService} from '../../admin/language-header.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-professeurs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './edit-professeurs.component.html',
  styleUrl: './edit-professeurs.component.css'
})
export class EditProfesseursComponent {
  UserForm: FormGroup;
  filePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  uuid: string = '';
  avatar_uuid: string | null = null;
  fileUrl: string | null = null;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router, 
    private route: ActivatedRoute,
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
  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    this.getTeachers();
  }
  avatarStorageUuid: string | null = null; // À déclarer dans ta classe
  getTeachers(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/teachers/get_by_uuid?uuid=${this.uuid}`).subscribe(
      (data) => {
        console.log('Données reçues :', data);
  
        // Stocke l’UUID de l’avatar pour une utilisation ultérieure
        this.avatarStorageUuid = data.avatar?.uuid || null;
        this.fileUrl = data.avatar?.url || null;
  
        console.log("UUID de l'avatar:", this.avatarStorageUuid);
        console.log("URL de l'avatar:", this.fileUrl);
  
        this.UserForm.patchValue({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          login : data.login || '',
          second_phone_number : data.phone_number_2 || '',
          grade : data.grade || '',
          address : data.address || '',
          avatar_uuid: this.avatarStorageUuid,
          
        });
      },
      (error) => {
        this.toastr.error('Impossible de charger les données');
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
        this.UserForm.patchValue({
          avatar_uuid: this.filePreview,  // mettre à jour le formulaire
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  }
  
  removeFile() {
    this.selectedFile = null;
    this.fileUrl = null;
    this.filePreview = null;
    this.UserForm.get('avatar_uuid')?.setValue("1");
  }
  onSubmit(): void {
    const formData = this.UserForm.value;
  
    const serviceData: any = {
      ...formData,
      avatar_uuid: formData.avatar_uuid || this.avatarStorageUuid || null,
      uuid: this.uuid,
    };
  
    // console.log("Données envoyées à UpdateStudent:", serviceData);
  
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput?.files?.[0];
  
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
  
      console.log("Uploading image...");
  
      this.http.post<any>(`${CONFIG.apiUrl}/storages/upload`, uploadForm).subscribe({
        next: (uploadResponse) => {
          const avatar_uuid = uploadResponse?.uuid;
  
          if (avatar_uuid) {
            serviceData.avatar_uuid = avatar_uuid;
            this.toastr.success("Image téléchargée avec succès.");
          } else {
            this.toastr.warning("UUID manquant. Enregistrement sans image.");
          }
  
          this.UpdateTeachers(serviceData);
        },
        error: (err) => {
          console.error("Erreur upload image:", err);
          this.toastr.error("Erreur lors du téléchargement de l'image.");
          // Utilise quand même l’image existante
          this.UpdateTeachers(serviceData);
        }
      });
    } else {
      // Pas de nouveau fichier, on envoie avec l’image existante
      this.UpdateTeachers(serviceData);
    }
  }
  
  UpdateTeachers(data: any): void {
    const headers = this.languageHeaderService.getLanguageHeader();
    this.http.put<any>(`${CONFIG.apiUrl}/teachers/update-teacher`, data,{headers}).subscribe({
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
