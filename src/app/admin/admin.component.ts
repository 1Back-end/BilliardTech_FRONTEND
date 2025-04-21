import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Router,RouterLink ,RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'; // Ajout de l'importation de TranslateService
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule,RouterLink, MenuComponent, CommonModule, TranslateModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isAuthenticated: boolean = false;
  centres: any[] = [];
  selectedCentre: string = '';
  userFullName: string = '';
  userInfo: { email: string, avatarUrl: string } = { email: '', avatarUrl: 'assets/images/profile_user.png' };

  currentLanguage: string = 'fr'; // Langue par défaut
  currentLanguageFlag: string = 'https://flagcdn.com/fr.svg'; // Drapeau par défaut
  currentLanguageName: string = 'Français'; // Nom de la langue par défaut

  @ViewChild('closeBtnOffCanvas') closeBtnOffCanvas!: ElementRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    // Vérifie si l'utilisateur est authentifié
    this.isAuthenticated = !!this.authService.getToken();
    
    this.userInfo = this.authService.getUserInfo();

    // Initialisation de la langue par défaut (français)
    this.translate.setDefaultLang('fr');
    this.translate.use('fr'); // Utilisation de la langue par défaut

    // Met à jour les informations de la langue active
    this.currentLanguage = this.translate.currentLang || 'fr';
    this.updateLanguageInfo();
  }
  


  logout(): void {
    this.authService.logout(); // Appel à la méthode de déconnexion
    this.router.navigate(['/login']); // Rediriger vers la page de login après déconnexion
  }

  // Fonction pour changer la langue
  changeLanguage(language: string): void {
    this.translate.use(language); // Change la langue active
    this.currentLanguage = language; // Met à jour la langue
    this.updateLanguageInfo(); // Met à jour le drapeau et le nom de la langue
  }

  // Fonction pour mettre à jour le drapeau et le nom de la langue active
  private updateLanguageInfo(): void {
    if (this.currentLanguage === 'fr') {
      this.currentLanguageFlag = 'https://flagcdn.com/fr.svg';
      this.currentLanguageName = 'Français';
    } else if (this.currentLanguage === 'en') {
      this.currentLanguageFlag = 'https://flagcdn.com/gb.svg';
      this.currentLanguageName = 'English';
    }
  }

  // Fonction pour fermer l'OffCanvas (menu latéral)
  closeOffCanvas(): void {
    if (this.closeBtnOffCanvas?.nativeElement) {
      this.closeBtnOffCanvas.nativeElement.click();
    }
  }
}
