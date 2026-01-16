import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit() {
    this.setMetaTags();
  }

  private setMetaTags() {
    this.title.setTitle('Kontakt - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Skontaktuj się z nami w DatabaseShop. Znajdź nasze dane kontaktowe, adres i formularz kontaktowy. Jesteśmy tutaj, aby pomóc!' });
    this.meta.updateTag({ name: 'keywords', content: 'kontakt, DatabaseShop, dane kontaktowe, adres, formularz kontaktowy, pomoc' });

    this.meta.updateTag({ property: 'og:title', content: 'Kontakt - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Skontaktuj się z nami w DatabaseShop. Znajdź nasze dane kontaktowe, adres i formularz kontaktowy. Jesteśmy tutaj, aby pomóc!' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
