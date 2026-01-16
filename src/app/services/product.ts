import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface ProductInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
  download_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'assets/data/products.json';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductInterface[]> {
    console.log('ProductService: getProducts called');
    console.log('ProductService: Fetching all products from:', this.productsUrl);
    console.log('ProductService: Full URL:', typeof window !== 'undefined' ? window.location.origin + '/' + this.productsUrl : 'SSR - no window');
    console.log('ProductService: isPlatformBrowser:', typeof window !== 'undefined');
    return this.http.get<ProductInterface[]>(this.productsUrl).pipe(
      map(products => {
        console.log('ProductService: getProducts - Successfully loaded products:', products.length, 'items');
        console.log('ProductService: getProducts - First product sample:', products[0] || 'No products');
        return products;
      }),
      catchError(error => {
        console.error('ProductService: getProducts - Error loading products:', error);
        console.error('ProductService: getProducts - Error details - status:', error.status, 'statusText:', error.statusText, 'url:', error.url);
        return of([]);
      })
    );
  }

  getProductsByCategory(categoryId: number): Observable<ProductInterface[]> {
    console.log('ProductService: getProductsByCategory called for category:', categoryId);
    console.log('ProductService: isPlatformBrowser:', typeof window !== 'undefined');
    return this.http.get<ProductInterface[]>(this.productsUrl).pipe(
      map(products => {
        const filteredProducts = products.filter(product => product.category_id === categoryId);
        console.log('ProductService: getProductsByCategory - Filtered products for category', categoryId, ':', filteredProducts.length, 'items');
        console.log('ProductService: getProductsByCategory - Sample filtered product:', filteredProducts[0] || 'No products in category');
        return filteredProducts;
      }),
      catchError(error => {
        console.error('ProductService: getProductsByCategory - Error loading products for category', categoryId, ':', error);
        return of([]);
      })
    );
  }
}
