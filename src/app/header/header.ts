import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';

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
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule, RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;
  currentUser: User | null = null;
  currentLanguage: string = 'pl';
  availableLanguages = [
    { code: 'pl', name: 'Polski' },
    { code: 'en', name: 'English' }
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.translationService.currentLang$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }

  getCurrentLanguageName(): string {
    const lang = this.availableLanguages.find(l => l.code === this.currentLanguage);
    return lang ? lang.name : 'Polski';
  }
}
