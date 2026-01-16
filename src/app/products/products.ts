import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ProductService, ProductInterface } from '../services/product';
import { ProductListComponent } from '../components/product-list/product-list';
import { ProductGridComponent } from '../components/product-grid/product-grid';
import { CartService } from '../services/cart.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductListComponent, ProductGridComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  products: ProductInterface[] = [];
  viewMode: 'list' | 'grid' = 'grid';
  categoryId: number | null = null;
  structuredData: SafeHtml = '';

  private title = inject(Title);
  private meta = inject(Meta);
  private sanitizer = inject(DomSanitizer);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    console.log('ProductsComponent: ngOnInit - Component initialized');
    console.log('ProductsComponent: ngOnInit - isPlatformBrowser:', typeof window !== 'undefined');
    console.log('ProductsComponent: ngOnInit - document.readyState:', typeof document !== 'undefined' ? document.readyState : 'N/A');
    this.route.params.subscribe(params => {
      this.categoryId = params['id'] ? +params['id'] : null;
      console.log('ProductsComponent: ngOnInit - Route params received:', params);
      console.log('ProductsComponent: ngOnInit - Category ID:', this.categoryId);
      this.loadProducts();
      this.setMetaTags();
    });
  }

  ngAfterViewInit() {
    console.log('ProductsComponent: ngAfterViewInit - View initialized');
    console.log('ProductsComponent: ngAfterViewInit - Products array length:', this.products.length);
  }

  ngOnDestroy() {
    console.log('ProductsComponent: ngOnDestroy - Component destroyed');
  }

  private setMetaTags() {
    if (this.categoryId) {
      const categoryName = this.getCategoryName(this.categoryId);
      this.title.setTitle(`${categoryName} - DatabaseShop`);

      this.meta.updateTag({ name: 'description', content: `Odkryj produkty z kategorii ${categoryName} w DatabaseShop. Szeroki wybór narzędzi i rozwiązań bazodanowych dla profesjonalistów IT.` });
      this.meta.updateTag({ name: 'keywords', content: `${categoryName}, bazy danych, narzędzia, oprogramowanie, IT, sklep technologiczny` });

      this.meta.updateTag({ property: 'og:title', content: `${categoryName} - DatabaseShop` });
      this.meta.updateTag({ property: 'og:description', content: `Odkryj produkty z kategorii ${categoryName} w DatabaseShop. Szeroki wybór narzędzi i rozwiązań bazodanowych dla profesjonalistów IT.` });
      this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
      this.meta.updateTag({ property: 'og:type', content: 'product.group' });
    } else {
      this.title.setTitle('Wszystkie Produkty - DatabaseShop');

      this.meta.updateTag({ name: 'description', content: 'Przeglądaj wszystkie produkty dostępne w DatabaseShop. Znajdź narzędzia, oprogramowanie i zasoby związane z bazami danych.' });
      this.meta.updateTag({ name: 'keywords', content: 'produkty, bazy danych, narzędzia, oprogramowanie, IT, sklep technologiczny' });

      this.meta.updateTag({ property: 'og:title', content: 'Wszystkie Produkty - DatabaseShop' });
      this.meta.updateTag({ property: 'og:description', content: 'Przeglądaj wszystkie produkty dostępne w DatabaseShop. Znajdź narzędzia, oprogramowanie i zasoby związane z bazami danych.' });
      this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
      this.meta.updateTag({ property: 'og:type', content: 'product.group' });
    }
  }

  private getCategoryName(categoryId: number): string {
    // Tutaj można dodać logikę mapowania ID kategorii na nazwy
    // Na razie zwracamy domyślną nazwę
    return `Kategoria ${categoryId}`;
  }

  loadProducts() {
    console.log('ProductsComponent: loadProducts called for categoryId:', this.categoryId);
    console.log('ProductsComponent: loadProducts - Current products array length:', this.products.length);
    console.log('ProductsComponent: loadProducts - isPlatformBrowser:', typeof window !== 'undefined');

    if (this.categoryId) {
      console.log('ProductsComponent: loadProducts - Fetching products by category:', this.categoryId);
      this.productService.getProductsByCategory(this.categoryId).subscribe(products => {
        console.log('ProductsComponent: loadProducts - Received products for category:', products.length, 'products');
        console.log('ProductsComponent: loadProducts - Products data:', products);
        this.products = products;
        this.generateStructuredData();
        console.log('ProductsComponent: loadProducts - Products loaded and structured data generated');
      });
    } else {
      console.log('ProductsComponent: loadProducts - Fetching all products');
      this.productService.getProducts().subscribe(products => {
        console.log('ProductsComponent: loadProducts - Received all products:', products.length, 'products');
        console.log('ProductsComponent: loadProducts - Products data:', products);
        this.products = products;
        this.generateStructuredData();
        console.log('ProductsComponent: loadProducts - All products loaded and structured data generated');
      });
    }
  }

  private generateStructuredData() {
    const itemListElements = this.products.map((product, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": product.name,
      "description": product.description,
      "image": product.image_url || '/assets/images/default-product.png',
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "PLN",
        "availability": "https://schema.org/InStock"
      },
      "brand": {
        "@type": "Brand",
        "name": "DatabaseShop"
      },
      "category": "Narzędzia bazodanowe"
    }));

    const structuredDataObj = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Produkty DatabaseShop",
      "description": "Lista produktów dostępnych w DatabaseShop - narzędzia i rozwiązania bazodanowe",
      "numberOfItems": this.products.length,
      "itemListElement": itemListElements
    };

    this.structuredData = this.sanitizer.bypassSecurityTrustHtml(
      `<script type="application/ld+json">${JSON.stringify(structuredDataObj, null, 2)}</script>`
    );
  }

  switchView(mode: 'list' | 'grid') {
    this.viewMode = mode;
  }

  onAddToCart(product: ProductInterface) {
    this.cartService.addToCart(product);
  }
}
