import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../../services/product';
import { CartService } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGridComponent implements OnChanges {
  @Input() products: ProductInterface[] = [];

  constructor(
    private cartService: CartService,
    public translationService: TranslationService
  ) {
    console.log('ProductGridComponent: Initialized');
  }

  ngOnChanges() {
    console.log('ProductGridComponent: Products changed:', this.products);
  }

  onAddToCart(product: ProductInterface) {
    console.log('ProductGridComponent: Adding to cart:', product);
    this.cartService.addToCart(product);
  }
}
