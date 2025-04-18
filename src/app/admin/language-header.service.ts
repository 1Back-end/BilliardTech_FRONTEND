import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageHeaderService {
  constructor(private translate: TranslateService) {}

  getLanguageHeader(): HttpHeaders {
    const currentLang = this.translate.currentLang || 'fr';
    return new HttpHeaders().set('Accept-Language', currentLang);
  }
}
