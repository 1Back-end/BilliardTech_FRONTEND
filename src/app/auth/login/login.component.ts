import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component ,ChangeDetectorRef, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // Ajout de l'importation de TranslateService
import { TranslateModule } from '@ngx-translate/core';
import {LanguageService } from '../../admin/language.service';
import {LanguageHeaderService} from '../../admin/language-header.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink,TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public languageService: LanguageService,
    private languageHeaderService: LanguageHeaderService, // 👈 Injecté en public pour le template
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.languageService.initLanguage(); // 👈 Init langue
  }
  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang); // 👈 Change langue via service
  }

  Login() {
    if (this.LoginForm.invalid) {
      this.toastr.error('Tous les champs sont requis');
      return;
    }
  
    const { email, password } = this.LoginForm.value;
  
    this.authService.login(email, password).subscribe({
      next: (response) => {
        const user = response.user;
        localStorage.setItem('user', btoa(JSON.stringify(user)));
  
        if (user.is_new_user) {
          this.toastr.success('Veuillez changer votre mot de passe');
          this.router.navigateByUrl('/auth/change-password');
          return;
        }
  
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (error) => {
        const message = error?.error?.detail || error?.error?.message || 'Erreur inconnue';
        this.toastr.error(message);  // Utilise le message du backend
        console.error("Erreur lors de la connexion :", error);
      }
    });
  }
  
  
}

