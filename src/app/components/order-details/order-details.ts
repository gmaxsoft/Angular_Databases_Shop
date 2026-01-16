import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { Meta, Title } from '@angular/platform-browser';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-order-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  orderId: number | null = null;
  currentUserId: number | null = null;

  private title = inject(Title);
  private meta = inject(Meta);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = currentUser.id;
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.orderId) {
      this.loadOrderDetails();
      this.setMetaTags(this.orderId);
    } else {
      this.router.navigate(['/user-panel']);
    }
  }

  private setMetaTags(orderId: number) {
    this.title.setTitle(`Szczegóły Zamówienia #${orderId} - DatabaseShop`);

    this.meta.updateTag({ name: 'description', content: `Przejrzyj szczegóły zamówienia #${orderId} w DatabaseShop. Sprawdź status zamówienia, produkty i informacje o dostawie.` });
    this.meta.updateTag({ name: 'keywords', content: `szczegóły zamówienia, zamówienie ${orderId}, DatabaseShop, status zamówienia, produkty` });

    this.meta.updateTag({ property: 'og:title', content: `Szczegóły Zamówienia #${orderId} - DatabaseShop` });
    this.meta.updateTag({ property: 'og:description', content: `Przejrzyj szczegóły zamówienia #${orderId} w DatabaseShop. Sprawdź status zamówienia, produkty i informacje o dostawie.` });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  loadOrderDetails(): void {
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe(order => {
        if (order && order.userId === this.currentUserId) {
          this.order = order;
        } else {
          // Jeśli zamówienie nie należy do użytkownika, przekieruj
          this.router.navigate(['/user-panel']);
        }
      });
    }
  }

  downloadOrder(): void {
    if (this.order) {
      const orderData = {
        id: this.order.id,
        data: new Date(this.order.createdAt).toLocaleDateString('pl-PL'),
        status: this.getStatusLabel(this.order.status),
        kwota: this.order.total.toFixed(2) + ' zł',
        produkty: this.order.items.map(item => ({
          nazwa: item.product.name,
          ilosc: item.quantity,
          cenaJednostkowa: item.product.price.toFixed(2) + ' zł',
          cenaCalkowita: (item.product.price * item.quantity).toFixed(2) + ' zł'
        }))
      };

      const dataStr = JSON.stringify(orderData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `zamowienie-${this.order.id}.json`;
      link.click();

      URL.revokeObjectURL(url);
    }
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Oczekujące',
      'processing': 'W trakcie',
      'shipped': 'Wysłane',
      'delivered': 'Dostarczone',
      'cancelled': 'Anulowane'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'warn',
      'processing': 'accent',
      'shipped': 'primary',
      'delivered': 'primary',
      'cancelled': 'warn'
    };
    return colorMap[status] || 'basic';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return amount.toFixed(2) + ' zł';
  }

  goBack(): void {
    this.router.navigate(['/user-panel']);
  }
}