import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;

  private title = inject(Title);
  private meta = inject(Meta);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public translationService: TranslationService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\(\)\s]+$/)]]
    });
  }

  ngOnInit(): void {
    this.setMetaTags();

    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm.patchValue({
      firstName: this.currentUser.firstName || '',
      lastName: this.currentUser.lastName || '',
      email: this.currentUser.email,
      address: this.currentUser.address || '',
      phone: this.currentUser.phone || ''
    });
  }

  private setMetaTags() {
    this.title.setTitle('Profil Użytkownika - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Zarządzaj swoim profilem użytkownika w DatabaseShop. Aktualizuj dane osobowe, adres dostawy i preferencje konta.' });
    this.meta.updateTag({ name: 'keywords', content: 'profil użytkownika, dane osobowe, DatabaseShop, konto, ustawienia' });

    this.meta.updateTag({ property: 'og:title', content: 'Profil Użytkownika - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Zarządzaj swoim profilem użytkownika w DatabaseShop. Aktualizuj dane osobowe, adres dostawy i preferencje konta.' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formData = this.profileForm.value;

      this.authService.updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        phone: formData.phone
      }).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            alert('Profil został zaktualizowany!');
          } else {
            alert('Błąd podczas aktualizacji profilu.');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Błąd podczas aktualizacji profilu.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) {
      return 'To pole jest wymagane';
    }
    if (control?.hasError('email')) {
      return 'Wprowadź prawidłowy adres email';
    }
    if (control?.hasError('minlength')) {
      return 'Minimalna długość to 2 znaki';
    }
    if (control?.hasError('pattern')) {
      return 'Wprowadź prawidłowy numer telefonu';
    }
    return '';
  }
}
