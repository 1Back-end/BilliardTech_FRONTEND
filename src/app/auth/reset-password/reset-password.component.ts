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
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Initialisation du formulaire avec validations
    this.changePasswordForm = this.fb.group({
      new_password: ['', [Validators.required, Validators.maxLength(8)]],
      confirm_new_password: ['', [Validators.required]]
    });
  }
  
  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.toastr.error('Veuillez remplir tous les champs correctement');
      return;
    }
  
    const { new_password, confirm_new_password } = this.changePasswordForm.value;
  
    if (new_password !== confirm_new_password) {
      this.toastr.error('Les mots de passe ne correspondent pas');
      return;
    }
  
    const email = localStorage.getItem('reset_email');
    const otp = localStorage.getItem('reset_otp');
  
    if (!email || !otp) {
      this.toastr.error('Session expirée. Veuillez recommencer');
      return;
    }
  
    const payload = {email,otp,new_password};
  
    this.http.post(`${CONFIG.apiUrl}/authentification/reset-password/administrator`, payload).subscribe(
      (response: any) => {
        this.toastr.success(response?.message || 'Mot de passe modifié avec succès');
        localStorage.removeItem('reset_email');
        localStorage.removeItem('reset_otp');
        this.router.navigate(['/login']);
      },
      (error) => {
        const message = error?.error?.detail || 'Une erreur est survenue. Essayez encore';
        this.toastr.error(message);
      }
    );
  }
  

}
