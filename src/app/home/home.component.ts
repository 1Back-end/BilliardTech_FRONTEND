import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component ,ChangeDetectorRef, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // Ajout de l'importation de TranslateService
import { TranslateModule } from '@ngx-translate/core';
import {LanguageService } from '../admin/language.service';
import {LanguageHeaderService} from '../admin/language-header.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  LoginForm: FormGroup;
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

}
