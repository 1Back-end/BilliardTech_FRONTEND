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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  qrCodeData: string = '';
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
    const student = this.studentResults[0]?.student;
        if (student) {
          const rawData = `Nom: ${student.first_name} ${student.last_name}
      Matricule: ${student.matricule}
      Email: ${student.email}`;

    this.qrCodeData = encodeURIComponent(rawData);
  }
    this.languageService.initLanguage(); // 👈 Init langue
  }
  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang); // 👈 Change langue via service
  }
  onSubmit(): void {
    if (this.ServiceForm.valid) {
      const matricule = this.ServiceForm.get('matricule')?.value;
      this.isLoading = true;  // Affichage du loader
  
      console.log('Appel à l\'API pour récupérer les résultats pour le matricule:', matricule);
  
      // Appel à l'API pour récupérer les résultats
      this.http.get<any[]>(`${CONFIG.apiUrl}/notes/students/${matricule}/exam-results`)
        .subscribe({
          next: (data) => {
            console.log('Réponse de l\'API:', data); // Affiche les résultats de l'API
            this.studentResults = data; // Stockage des résultats
  
            // Simuler un délai de 3 secondes avant de masquer le loader
            setTimeout(() => {
              this.isLoading = false; // Arrêt du chargement
            }, 3000);  // 3 secondes
          },
          error: (error) => {
            console.error('Erreur lors de l\'appel API:', error); 
            this.toastr.error('Une erreur est survenue lors de la récupération des résultats.');
            this.isLoading = false;
          }
        });
    }
  }
  generatePDF() {
    const content: any = document.getElementById('result-pdf-content');
  
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('releve-notes.pdf');
    });
  }
 
}
 