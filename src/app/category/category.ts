import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ProductService, ProductInterface } from '../services/product';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../components/product-list/product-list';
import { ProductGridComponent } from '../components/product-grid/product-grid';

@Component({
  selector: 'app-category',
  imports: [CommonModule, ProductListComponent, ProductGridComponent],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class CategoryComponent implements OnInit {
  categoryId: number | null = null;
  products: ProductInterface[] = [];
  viewMode: 'list' | 'grid' = 'grid';

  private title = inject(Title);
  private meta = inject(Meta);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  ngOnInit() {
    console.log('CategoryComponent: ngOnInit - Component initialized');
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
      console.log('CategoryComponent: ngOnInit - Route params received:', params);
      console.log('CategoryComponent: ngOnInit - Category ID:', categoryId);
      this.categoryId = categoryId ? +categoryId : null;
      console.log('CategoryComponent: ngOnInit - Parsed categoryId:', this.categoryId);
      if (this.categoryId) {
        console.log('CategoryComponent: ngOnInit - Setting meta tags for category:', this.categoryId);
        this.setMetaTags(this.categoryId);
        this.loadProducts();
      } else {
        console.log('CategoryComponent: ngOnInit - No category ID found in params');
      }
    });
  }

  private loadProducts() {
    if (this.categoryId) {
      console.log('CategoryComponent: loadProducts - Loading products for category:', this.categoryId);
      this.productService.getProductsByCategory(this.categoryId).subscribe(products => {
        console.log('CategoryComponent: loadProducts - Received products:', products.length, 'products');
        console.log('CategoryComponent: loadProducts - Products data:', products);
        this.products = products;
      });
    }
  }

  private setMetaTags(categoryId: number) {
    const categoryName = this.getCategoryName(categoryId);
    this.title.setTitle(`${categoryName} - DatabaseShop`);

    this.meta.updateTag({ name: 'description', content: `Przeglądaj produkty z kategorii ${categoryName} w DatabaseShop. Znajdź narzędzia, oprogramowanie i zasoby związane z bazami danych.` });
    this.meta.updateTag({ name: 'keywords', content: `${categoryName}, bazy danych, kategoria, produkty, narzędzia IT` });

    this.meta.updateTag({ property: 'og:title', content: `${categoryName} - DatabaseShop` });
    this.meta.updateTag({ property: 'og:description', content: `Przeglądaj produkty z kategorii ${categoryName} w DatabaseShop. Znajdź narzędzia, oprogramowanie i zasoby związane z bazami danych.` });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  private getCategoryName(categoryId: number): string {
    // Tutaj można dodać logikę mapowania ID kategorii na nazwy
    return `Kategoria ${categoryId}`;
  }

  switchView(mode: 'list' | 'grid') {
    this.viewMode = mode;
  }

  onAddToCart(product: ProductInterface) {
    console.log('CategoryComponent: Adding to cart:', product);
    // Tutaj można dodać logikę dodawania do koszyka
  }
}
