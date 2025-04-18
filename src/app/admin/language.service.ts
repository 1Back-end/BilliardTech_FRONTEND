import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLanguage: string = 'fr';
  currentLanguageFlag: string = 'https://flagcdn.com/fr.svg';
  currentLanguageName: string = 'Français';

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  initLanguage(): void {
    this.currentLanguage = this.translate.currentLang || 'fr';
    this.translate.use(this.currentLanguage);
    this.updateLanguageInfo();
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguage = language;
    this.updateLanguageInfo();
  }

  private updateLanguageInfo(): void {
    if (this.currentLanguage === 'fr') {
      this.currentLanguageFlag = 'https://flagcdn.com/fr.svg';
      this.currentLanguageName = 'Français';
    } else if (this.currentLanguage === 'en') {
      this.currentLanguageFlag = 'https://flagcdn.com/gb.svg';
      this.currentLanguageName = 'English';
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getCurrentFlag(): string {
    return this.currentLanguageFlag;
  }

  getCurrentLanguageName(): string {
    return this.currentLanguageName;
  }
}
