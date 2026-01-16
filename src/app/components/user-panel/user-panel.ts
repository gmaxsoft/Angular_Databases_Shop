import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Meta, Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-panel',
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.scss',
})
export class UserPanelComponent implements OnInit {
  displayedColumns: string[] = ['id', 'date', 'status', 'total', 'actions'];
  orders: Order[] = [];
  currentUserId: number | null = null;

  private title = inject(Title);
  private meta = inject(Meta);

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setMetaTags();

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = currentUser.id;
    this.loadOrders();
  }

  private setMetaTags() {
    this.title.setTitle('Panel Użytkownika - DatabaseShop');

    this.meta.updateTag({ name: 'description', content: 'Zarządzaj swoimi zamówieniami w panelu użytkownika DatabaseShop. Śledź status zamówień, przeglądaj historię zakupów i zarządzaj kontem.' });
    this.meta.updateTag({ name: 'keywords', content: 'panel użytkownika, zamówienia, DatabaseShop, historia zakupów, konto' });

    this.meta.updateTag({ property: 'og:title', content: 'Panel Użytkownika - DatabaseShop' });
    this.meta.updateTag({ property: 'og:description', content: 'Zarządzaj swoimi zamówieniami w panelu użytkownika DatabaseShop. Śledź status zamówień, przeglądaj historię zakupów i zarządzaj kontem.' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/database-shop-logo.png' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  loadOrders(): void {
    if (this.currentUserId) {
      this.orderService.getOrdersByUser(this.currentUserId).subscribe(orders => {
        this.orders = orders;
      });
    }
  }

  downloadOrder(order: Order): void {
    // Prosta implementacja pobierania - w rzeczywistości można wygenerować PDF lub plik
    const orderData = {
      id: order.id,
      data: new Date(order.createdAt).toLocaleDateString('pl-PL'),
      status: this.getStatusLabel(order.status),
      kwota: order.total.toFixed(2) + ' zł',
      produkty: order.items.map(item => ({
        nazwa: item.product.name,
        ilosc: item.quantity,
        cena: item.product.price.toFixed(2) + ' zł'
      }))
    };

    const dataStr = JSON.stringify(orderData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `zamowienie-${order.id}.json`;
    link.click();

    URL.revokeObjectURL(url);
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL');
  }

  formatCurrency(amount: number): string {
    return amount.toFixed(2) + ' zł';
  }
}