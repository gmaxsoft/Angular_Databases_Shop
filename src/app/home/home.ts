import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private title = inject(Title);
  private meta = inject(Meta);
  private translationService = inject(TranslationService);
  private langSubscription!: Subscription;

  ngOnInit() {
    this.setMetaTags();
    this.langSubscription = this.translationService.currentLang$.subscribe(() => {
      this.setMetaTags();
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private setMetaTags() {
    this.title.setTitle(this.translationService.instant('meta.title'));

    this.meta.updateTag({ name: 'description', content: this.translationService.instant('meta.description') });
    this.meta.updateTag({ name: 'keywords', content: 'bazy danych, SQL, NoSQL, narzędzia bazodanowe, oprogramowanie IT, sklep technologiczny' });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: this.translationService.instant('meta.title') });
    this.meta.updateTag({ property: 'og:description', content: this.translationService.instant('meta.description') });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
