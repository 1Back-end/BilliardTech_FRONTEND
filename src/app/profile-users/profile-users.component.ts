import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.css']
})
export class ProfileUsersComponent implements OnInit {

  UserForm: FormGroup;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  fileUrl: string | null = null;

  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.UserForm = this.fb.group({
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      login: ['', Validators.required],
      country_code: ['', Validators.required],
      avatar_uuid: [null]
    });
  }
  
  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('token') || '{}')?.access_token;
  
    if (token) {
      this.http.get(`${CONFIG.apiUrl}/authentification/me/administrator`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe((response: any) => {
        console.log('Réponse du serveur :', response); // <= ajoute ceci
        this.patchUserForm(response);
      }, error => {
        this.toastr.error("Erreur lors du chargement du profil.");
      });
    }
  }
  avatarStorageUuid: string | null = null; // À déclarer dans ta classe

  patchUserForm(data: any): void {
    console.log('Données utilisateur reçues:', data);
    this.avatarStorageUuid = data.avatar?.uuid || null;
      this.fileUrl = data.avatar?.url || null;
  
      console.log("UUID de l'avatar:", this.avatarStorageUuid);
      console.log("URL de l'avatar:", this.fileUrl);
    this.UserForm.patchValue({
      last_name: data.last_name || '',
      first_name: data.first_name || '',
      email: data.email || '',
      phone_number: data.phone_number || '',
      login: data.login || '',
      country_code: data.country_code || '',
      avatar_uuid: this.avatarStorageUuid // On met l'UUID ici, pas l'URL
    });
  
    
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
  //   if (this.UserForm.invalid) {
  //     this.toastr.warning("Veuillez remplir correctement le formulaire.");
  //     return;
  //   }

  //   const token = JSON.parse(localStorage.getItem('token') || '{}')?.access_token;
  //   if (!token) {
  //     this.toastr.error("Utilisateur non authentifié.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   Object.entries(this.UserForm.value).forEach(([key, value]) => {
  //     formData.append(key, value);
  //   });

  //   if (this.selectedFile) {
  //     formData.append('profile_image', this.selectedFile);
  //   }

  //   this.http.post(`${CONFIG.apiUrl}/authentification/update-profile`, formData, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   }).subscribe(
  //     () => this.toastr.success("Profil mis à jour avec succès."),
  //     () => this.toastr.error("Une erreur est survenue lors de la mise à jour.")
  //   );
  // }
}
}