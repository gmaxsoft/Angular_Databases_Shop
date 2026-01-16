import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit() {
    this.setMetaTags();
  }

  private setMetaTags() {
    this.title.setTitle('O Nas - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Poznaj historię DatabaseShop - wiodącego sklepu z narzędziami i rozwiązaniami bazodanowymi. Dowiedz się więcej o naszej misji i wartościach.' });
    this.meta.updateTag({ name: 'keywords', content: 'o nas, DatabaseShop, sklep bazodanowy, historia firmy, misja, wartości' });

    this.meta.updateTag({ property: 'og:title', content: 'O Nas - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Poznaj historię DatabaseShop - wiodącego sklepu z narzędziami i rozwiązaniami bazodanowymi. Dowiedz się więcej o naszej misji i wartościach.' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
