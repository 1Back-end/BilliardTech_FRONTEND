import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-edit-utilisateurs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-utilisateurs.component.html',
  styleUrl: './edit-utilisateurs.component.css'
})
export class EditUtilisateursComponent {
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
    private route: ActivatedRoute
  ) {
    this.UserForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country_code: ['+237', [Validators.required,Validators.pattern(/^\+237$/)]],
      phone_number: [null, [Validators.required,Validators.pattern(/^([6-9]{1}[0-9]{8})$/)]],  // Validation pour le numéro de téléphone
      role: ['', Validators.required],
      login: ['', Validators.required],
      avatar_uuid : [null]
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
          storage_uuid: this.filePreview,  // mettre à jour le formulaire
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  }
  
  removeFile() {
    this.selectedFile = null;
    this.fileUrl = null;
    this.filePreview = null;
    this.UserForm.get('storage_uuid')?.setValue("1");
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    this.getUsers();
  }
  avatarStorageUuid: string | null = null; // À déclarer dans ta classe

  getUsers(): void {
    this.http.get<any>(`${CONFIG.apiUrl}/users/get_by_uuid?uuid=${this.uuid}`).subscribe(
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
          role : data.role || '',
          avatar_uuid: this.avatarStorageUuid,
          
        });
      },
      (error) => {
        this.toastr.error('Impossible de charger les données');
      }
    );
  }


  onSubmit(): void {
    const formData = this.UserForm.value;
  
    const serviceData: any = {
      ...formData,
      avatar_uuid: formData.avatar_uuid || this.avatarStorageUuid || null,
      uuid: this.uuid,
    };
  
    console.log("Données envoyées à UpdateStudent:", serviceData);
  
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
  
          this.UpdateUsers(serviceData);
        },
        error: (err) => {
          console.error("Erreur upload image:", err);
          this.toastr.error("Erreur lors du téléchargement de l'image.");
          // Utilise quand même l’image existante
          this.UpdateUsers(serviceData);
        }
      });
    } else {
      // Pas de nouveau fichier, on envoie avec l’image existante
      this.UpdateUsers(serviceData);
    }
  }
  
  UpdateUsers(data: any): void {
    this.http.put<any>(`${CONFIG.apiUrl}/users/update`, data).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/users']);
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
