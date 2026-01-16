import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar';
import { TranslationService } from '../services/translation.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [TranslationService, provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const mockCategories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' }
    ];

    const req = httpMock.expectOne('assets/data/categories.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);

    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Category 1');
  });
});
