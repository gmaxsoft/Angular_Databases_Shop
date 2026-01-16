import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isProcessing = false;

  paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Płatność przez PayPal',
      icon: 'account_balance_wallet'
    },
    {
      id: 'przelewy24',
      name: 'Przelewy24',
      description: 'Płatność przez Przelewy24',
      icon: 'credit_card'
    }
  ];

  private cartSubscription!: Subscription;
  private langSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    public translationService: TranslationService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\(\)\s]+$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      paymentMethod: ['paypal', [Validators.required]]
    });
  }

  ngOnInit() {
    // Check if user is logged in
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
        return;
      }
    });

    this.cartService.getTotalPrice().subscribe(total => {
      this.totalPrice = total;
    });

    this.langSubscription = this.translationService.currentLang$.subscribe(() => {
      // Form will automatically update when language changes
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isProcessing = true;

      const orderData: Partial<Order> = {
        userId: this.authService.getCurrentUser()?.id,
        items: this.cartItems,
        shippingAddress: {
          firstName: this.checkoutForm.value.firstName,
          lastName: this.checkoutForm.value.lastName,
          email: this.checkoutForm.value.email,
          phone: this.checkoutForm.value.phone,
          address: this.checkoutForm.value.address,
          city: this.checkoutForm.value.city,
          postalCode: this.checkoutForm.value.postalCode
        },
        paymentMethod: this.checkoutForm.value.paymentMethod,
        total: this.totalPrice,
        status: 'pending' as const
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          // Clear cart after successful order
          this.cartService.clearCart();

          // Redirect to order details or success page
          this.router.navigate(['/user-panel/orders', order.id]);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.isProcessing = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.checkoutForm.get(field);
    if (control?.hasError('required')) {
      return this.translationService.instant('checkout.errors.required');
    }
    if (control?.hasError('email')) {
      return this.translationService.instant('checkout.errors.email');
    }
    if (control?.hasError('minlength')) {
      return this.translationService.instant('checkout.errors.minLength');
    }
    if (control?.hasError('pattern')) {
      return this.translationService.instant('checkout.errors.pattern');
    }
    return '';
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}