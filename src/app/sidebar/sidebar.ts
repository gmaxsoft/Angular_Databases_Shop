import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [MatListModule, RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  private langSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.http.get<Category[]>('assets/data/categories.json').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    this.langSubscription = this.translationService.currentLang$.subscribe(() => {
      // Sidebar will automatically update when language changes
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
