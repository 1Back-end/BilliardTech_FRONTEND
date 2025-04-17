import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient ,HttpParams} from '@angular/common/http';  // Import HttpClient
import { CONFIG } from '../../../config';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  LoginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient, private router: Router,
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
    if (this.LoginForm.invalid) {
      this.toastr.error('Tous les champs sont requis');
      return;
    }
    const email = this.LoginForm.value.email;
    this.http.post(`${CONFIG.apiUrl}/authentification/start-reset-password/administrator`, { email }).subscribe(
      (res: any) => {
        this.toastr.success(res.message || 'Un code a été envoyé à votre adresse email');
        // Stocker l'email pour l'utiliser à l'étape OTP si besoin
        localStorage.setItem('reset_email', email);
        // Redirection vers la page du code OTP
        this.router.navigate(['/auth/code-otp']);
      },
      (err) => {
        const msg = err?.error?.detail || "Une erreur est survenue. Vérifiez l'adresse email";
        this.toastr.error(msg);
      }
    );
  }
  
  

}
