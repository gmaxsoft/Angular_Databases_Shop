import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';

  private title = inject(Title);
  private meta = inject(Meta);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public translationService: TranslationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.setMetaTags();
  }

  private setMetaTags() {
    this.title.setTitle('Rejestracja - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Zarejestruj nowe konto w DatabaseShop. Uzyskaj dostęp do spersonalizowanych usług, śledzenia zamówień i ekskluzywnych ofert.' });
    this.meta.updateTag({ name: 'keywords', content: 'rejestracja, konto, DatabaseShop, nowe konto, zamówienia, profil' });

    this.meta.updateTag({ property: 'og:title', content: 'Rejestracja - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Zarejestruj nowe konto w DatabaseShop. Uzyskaj dostęp do spersonalizowanych usług, śledzenia zamówień i ekskluzywnych ofert.' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.authService.register(userData).subscribe(success => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Registration failed';
        }
      });
    }
  }
}