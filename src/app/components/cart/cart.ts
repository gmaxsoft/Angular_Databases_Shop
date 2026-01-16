import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CartService, CartItem } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  private title = inject(Title);
  private meta = inject(Meta);

  constructor(
    private cartService: CartService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
    this.cartService.getTotalPrice().subscribe(total => {
      this.totalPrice = total;
    });
  }

  private setMetaTags() {
    this.title.setTitle('Koszyk - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Przejrzyj zawartość swojego koszyka w DatabaseShop. Sprawdź produkty, dostosuj ilości i przejdź do finalizacji zamówienia.' });
    this.meta.updateTag({ name: 'keywords', content: 'koszyk, zamówienia, produkty, DatabaseShop, sklep' });

    this.meta.updateTag({ property: 'og:title', content: 'Koszyk - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Przejrzyj zawartość swojego koszyka w DatabaseShop. Sprawdź produkty, dostosuj ilości i przejdź do finalizacji zamówienia.' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
