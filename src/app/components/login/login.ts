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
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  private title = inject(Title);
  private meta = inject(Meta);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public translationService: TranslationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.setMetaTags();
  }

  private setMetaTags() {
    this.title.setTitle('Logowanie - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Zaloguj się do swojego konta w DatabaseShop. Dostęp do zamówień, profilu użytkownika i spersonalizowanych usług.' });
    this.meta.updateTag({ name: 'keywords', content: 'logowanie, konto, DatabaseShop, zamówienia, profil użytkownika' });

    this.meta.updateTag({ property: 'og:title', content: 'Logowanie - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Zaloguj się do swojego konta w DatabaseShop. Dostęp do zamówień, profilu użytkownika i spersonalizowanych usług.' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(success => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      });
    }
  }
}