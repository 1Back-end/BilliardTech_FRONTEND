// translate.loader.ts
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function httpTranslateLoader(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './asset/i18n/', '.json');
}
