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
  selector: 'app-code-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './code-otp.component.html',
  styleUrl: './code-otp.component.css'
})
export class CodeOtpComponent {
  LoginForm: FormGroup;
  
  constructor(
    private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient, private router: Router,
  ) {
    this.LoginForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
    
  }
  onSubmit() {
    if (this.LoginForm.invalid) {
      this.toastr.error('Tous les champs sont requis');
      return;
    }
  
    const otp = this.LoginForm.value.otp;
    const email = localStorage.getItem('reset_email'); // récupérer l'email
  
    if (!email) {
      this.toastr.error("Aucune adresse email trouvée. Veuillez recommencer la procédure.");
      return;
    }
    this.http.post(`${CONFIG.apiUrl}/authentification/check-otp-password/administrator`, {
      otp,
      email
    }).subscribe(
      (res: any) => {
        this.toastr.success(res.message || 'Code vérifié avec succès');
        // Enregistrement de l'otp + email pour l'étape de reset
        localStorage.setItem('reset_email', email);
        localStorage.setItem('reset_otp', otp);  
        // Redirection vers la page de reset du mot de passe
        this.router.navigate(['/auth/reset-password']);
      },
      (err) => {
        const msg = err?.error?.detail || "Code incorrect ou expiré";
        this.toastr.error(msg);
      }
    );
  }
  

}
