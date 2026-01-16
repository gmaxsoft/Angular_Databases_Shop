import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = new BehaviorSubject<any>({});
  private currentLang = new BehaviorSubject<string>('pl');

  public translations$ = this.translations.asObservable();
  public currentLang$ = this.currentLang.asObservable();

  constructor(private http: HttpClient) {
    this.loadTranslations('pl');
  }

  get currentLanguage(): string {
    return this.currentLang.value;
  }

  setLanguage(lang: string): void {
    this.currentLang.next(lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: string): void {
    this.http.get<any>(`/assets/i18n/${lang}.json`).subscribe({
      next: (translations) => {
        this.translations.next(translations);
      },
      error: (error) => {
        console.error(`Failed to load translations for ${lang}:`, error);
      }
    });
  }

  translate(key: string, params?: any): Observable<string> {
    return this.translations$.pipe(
      map(translations => {
        const value = this.getValueFromKey(key, translations);
        return params ? this.interpolate(value, params) : value;
      })
    );
  }

  instant(key: string, params?: any): string {
    const translations = this.translations.value;
    const value = this.getValueFromKey(key, translations);
    return params ? this.interpolate(value, params) : value;
  }

  private getValueFromKey(key: string, translations: any): string {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations) || key;
  }

  private interpolate(text: string, params: any): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
  }
}