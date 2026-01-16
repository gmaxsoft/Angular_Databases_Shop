import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../../services/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnChanges {
  @Input() products: ProductInterface[] = [];

  constructor(private cartService: CartService) {
    console.log('ProductListComponent: Initialized');
  }

  ngOnChanges() {
    console.log('ProductListComponent: Products changed:', this.products);
  }

  onAddToCart(product: ProductInterface) {
    console.log('ProductListComponent: Adding to cart:', product);
    this.cartService.addToCart(product);
  }
}
