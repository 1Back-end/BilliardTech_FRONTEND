import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component ,ChangeDetectorRef} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  Login() {
    if (this.LoginForm.invalid) {
      this.toastr.error('Tous les champs sont requis');
      return;
    }
  
    this.authService.login(
      this.LoginForm.value.email,
      this.LoginForm.value.password
    ).subscribe({
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
        const message = error?.error?.detail;
        this.toastr.error(message);
      }
    });
  }
  
}

