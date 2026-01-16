import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  imports: [MatCardModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  private langSubscription!: Subscription;

  constructor(public translationService: TranslationService) {}

  ngOnInit() {
    this.langSubscription = this.translationService.currentLang$.subscribe(() => {
      // Footer will automatically update when language changes due to OnPush change detection
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
