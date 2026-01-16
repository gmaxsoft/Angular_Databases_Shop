import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CartItem } from './cart.service';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  private loadOrders(): void {
    let storedOrders: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      storedOrders = localStorage.getItem('orders');
    }
    if (storedOrders) {
      this.ordersSubject.next(JSON.parse(storedOrders));
    } else {
      this.http.get<Order[]>('/assets/data/orders.json').pipe(
        catchError(() => of([]))
      ).subscribe(orders => {
        this.ordersSubject.next(orders);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('orders', JSON.stringify(orders));
        }
      });
    }
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    return new Observable<Order>(observer => {
      const currentOrders = this.ordersSubject.value;
      const total = orderData.total || orderData.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

      const newOrder: Order = {
        id: currentOrders.length > 0 ? Math.max(...currentOrders.map(o => o.id)) + 1 : 1,
        userId: orderData.userId!,
        items: orderData.items || [],
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedOrders = [...currentOrders, newOrder];
      this.ordersSubject.next(updatedOrders);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
      }

      observer.next(newOrder);
      observer.complete();
    });
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    return new Observable<Order[]>(observer => {
      this.orders$.subscribe(orders => {
        observer.next(orders.filter(order => order.userId === userId));
      });
    });
  }

  getOrderById(orderId: number): Observable<Order | null> {
    return new Observable<Order | null>(observer => {
      this.orders$.subscribe(orders => {
        const order = orders.find(o => o.id === orderId);
        observer.next(order || null);
      });
    });
  }

  updateOrderStatus(orderId: number, status: Order['status']): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const currentOrders = this.ordersSubject.value;
      const orderIndex = currentOrders.findIndex(o => o.id === orderId);

      if (orderIndex !== -1) {
        currentOrders[orderIndex].status = status;
        currentOrders[orderIndex].updatedAt = new Date().toISOString();
        this.ordersSubject.next([...currentOrders]);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('orders', JSON.stringify(currentOrders));
        }
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }
}