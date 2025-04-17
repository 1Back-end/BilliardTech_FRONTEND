import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CONFIG } from '../../../config';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Initialisation du formulaire avec validation
    this.changePasswordForm = this.fb.group({
      email: ['', Validators.required],
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.toastr.error('Veuillez remplir tous les champs correctement');
      return;
    }

    const formData = this.changePasswordForm.value;

    // Récupération du token depuis le localStorage
    const storedToken = localStorage.getItem('token');
    const token = storedToken ? JSON.parse(storedToken)?.access_token : null;

    if (!token) {
      this.toastr.error('Vous devez être connecté pour modifier votre mot de passe');
      return;
    }

    // Appel à l'API backend pour changer le mot de passe
    this.http.put(`${CONFIG.apiUrl}/authentification/change-password`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(
      (response: any) => {
        this.toastr.success(response?.message || 'Mot de passe modifié avec succès');
        this.router.navigate(['/login']);
      },
      (error) => {
        const message = error?.error?.detail || 'Une erreur est survenue. Essayez encore';
        this.toastr.error(message);
      }
    );
  }
}
