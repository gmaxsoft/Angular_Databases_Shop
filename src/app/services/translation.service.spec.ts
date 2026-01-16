import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default language (pl) on initialization', () => {
    const mockTranslations = {
      'app.title': 'Database Shop',
      'cart.title': 'Koszyk'
    };

    const req = httpMock.expectOne('/assets/i18n/pl.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);

    expect(service.currentLanguage).toBe('pl');
  });

  it('should change language', () => {
    const mockPlTranslations = { 'app.title': 'Database Shop' };
    const mockEnTranslations = { 'app.title': 'Database Shop' };

    // Initial load
    const req1 = httpMock.expectOne('/assets/i18n/pl.json');
    req1.flush(mockPlTranslations);

    service.setLanguage('en');
    expect(service.currentLanguage).toBe('en');

    const req2 = httpMock.expectOne('/assets/i18n/en.json');
    req2.flush(mockEnTranslations);
  });

  it('should translate key correctly', (done) => {
    const mockTranslations = {
      'app.title': 'Database Shop',
      'cart.title': 'Shopping Cart'
    };

    const req = httpMock.expectOne('/assets/i18n/pl.json');
    req.flush(mockTranslations);

    service.translate('app.title').subscribe(translation => {
      expect(translation).toBe('Database Shop');
      done();
    });
  });

  it('should return key if translation not found', (done) => {
    const mockTranslations = {
      'app.title': 'Database Shop'
    };

    const req = httpMock.expectOne('/assets/i18n/pl.json');
    req.flush(mockTranslations);

    service.translate('app.nonexistent').subscribe(translation => {
      expect(translation).toBe('app.nonexistent');
      done();
    });
  });

  it('should handle nested keys', (done) => {
    const mockTranslations = {
      app: {
        title: 'Database Shop',
        cart: {
          title: 'Shopping Cart'
        }
      }
    };

    const req = httpMock.expectOne('/assets/i18n/pl.json');
    req.flush(mockTranslations);

    service.translate('app.cart.title').subscribe(translation => {
      expect(translation).toBe('Shopping Cart');
      done();
    });
  });

  it('should interpolate parameters', (done) => {
    const mockTranslations = {
      'welcome.message': 'Hello {{name}}, welcome!'
    };

    const req = httpMock.expectOne('/assets/i18n/pl.json');
    req.flush(mockTranslations);

    service.translate('welcome.message', { name: 'John' }).subscribe(translation => {
      expect(translation).toBe('Hello John, welcome!');
      done();
    });
  });

  it('should use instant method for synchronous translation', () => {
    const mockTranslations = {
      'app.title': 'Database Shop'
    };

    const req = httpMock.expectOne('/assets/i18n/pl.json');
    req.flush(mockTranslations);

    const translation = service.instant('app.title');
    expect(translation).toBe('Database Shop');
  });

  it('should handle HTTP errors gracefully', () => {
    const req = httpMock.expectOne('/assets/i18n/pl.json');
    req.error(new ErrorEvent('Network error'));

    // Service should still be created and handle error
    expect(service).toBeTruthy();
  });
});
