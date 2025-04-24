import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators ,FormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component ,ChangeDetectorRef, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // Ajout de l'importation de TranslateService
import { TranslateModule } from '@ngx-translate/core';
import {LanguageService } from '../admin/language.service';
import {LanguageHeaderService} from '../admin/language-header.service';
import { HttpClient } from '@angular/common/http'; // Ajout de l'importation d'HttpClient
import { CONFIG } from '../../config';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,FormsModule,TranslateModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ServiceForm: FormGroup;
  studentResults: any[] = []; // Pour stocker les résultats de l'étudiant
  isLoading: boolean = false; // Pour indiquer le chargement des résultats

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public languageService: LanguageService,
    private languageHeaderService: LanguageHeaderService, // 👈 Injecté en public pour le template
    private http: HttpClient // Injection de HttpClient
  ) {
    this.ServiceForm = this.fb.group({
      matricule: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.languageService.initLanguage(); // 👈 Init langue
  }
  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang); // 👈 Change langue via service
  }
  onSubmit(): void {
    if (this.ServiceForm.valid) {
      const matricule = this.ServiceForm.get('matricule')?.value;
      this.isLoading = true;
  
      console.log('Appel à l\'API pour récupérer les résultats pour le matricule:', matricule);
  
      // Appel à l'API pour récupérer les résultats de l'étudiant
      this.http.get<any[]>(`${CONFIG.apiUrl}/notes/students/${matricule}/exam-results`)
        .subscribe({
          next: (data) => {
            console.log('Réponse de l\'API:', data); // Affiche la réponse brute de l'API
            this.studentResults = data; // Stockage des résultats
            console.log('Résultats stockés:', this.studentResults);
  
            // Génération du PDF
            // this.generatePDF(this.studentResults); // Appel à la fonction pour générer le PDF
            this.isLoading = false; // Arrêt du chargement
          },
          error: (error) => {
            console.error('Erreur lors de l\'appel API:', error); 
            this.toastr.error('Une erreur est survenue lors de la récupération des résultats.');
            this.isLoading = false;
          }
        });
    }
  }
  
 
}
