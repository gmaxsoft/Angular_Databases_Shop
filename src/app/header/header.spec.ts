import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [CartService, AuthService, TranslationService, provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on authService when logout is called', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'logout');
    
    component.logout();
    expect(spy).toHaveBeenCalled();
  });

  it('should change language when changeLanguage is called', () => {
    const translationService = TestBed.inject(TranslationService);
    const spy = spyOn(translationService, 'setLanguage');
    
    component.changeLanguage('en');
    expect(spy).toHaveBeenCalledWith('en');
  });
});
