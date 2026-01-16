import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService, Order } from './order.service';
import { CartItem } from './cart.service';
import { ProductInterface } from './product';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockProduct: ProductInterface = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category_id: 1,
    image_url: 'test.jpg',
    download_url: 'download.zip'
  };

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load orders from JSON file', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        userId: 1,
        items: [mockCartItem],
        total: 199.98,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    const req = httpMock.expectOne('/assets/data/orders.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);

    service.orders$.subscribe(orders => {
      expect(orders.length).toBe(1);
    });
  });

  it('should create new order', (done) => {
    const mockOrders: Order[] = [];

    // Load initial orders
    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.createOrder({
      userId: 1,
      items: [mockCartItem],
      total: 199.98
    }).subscribe(order => {
      expect(order.id).toBe(1);
      expect(order.userId).toBe(1);
      expect(order.items.length).toBe(1);
      expect(order.total).toBe(199.98);
      expect(order.status).toBe('pending');
      expect(order.createdAt).toBeDefined();
      done();
    });
  });

  it('should calculate total automatically if not provided', (done) => {
    const mockOrders: Order[] = [];

    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.createOrder({
      userId: 1,
      items: [mockCartItem]
    }).subscribe(order => {
      expect(order.total).toBe(199.98); // 99.99 * 2
      done();
    });
  });

  it('should get orders by user ID', (done) => {
    const mockOrders: Order[] = [
      {
        id: 1,
        userId: 1,
        items: [mockCartItem],
        total: 199.98,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        userId: 2,
        items: [mockCartItem],
        total: 199.98,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.getOrdersByUser(1).subscribe(orders => {
      expect(orders.length).toBe(1);
      expect(orders[0].userId).toBe(1);
      done();
    });
  });

  it('should get order by ID', (done) => {
    const mockOrders: Order[] = [
      {
        id: 1,
        userId: 1,
        items: [mockCartItem],
        total: 199.98,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.getOrderById(1).subscribe(order => {
      expect(order).toBeTruthy();
      expect(order?.id).toBe(1);
      done();
    });
  });

  it('should return null for non-existent order', (done) => {
    const mockOrders: Order[] = [];

    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.getOrderById(999).subscribe(order => {
      expect(order).toBeNull();
      done();
    });
  });

  it('should update order status', (done) => {
    const mockOrders: Order[] = [
      {
        id: 1,
        userId: 1,
        items: [mockCartItem],
        total: 199.98,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.updateOrderStatus(1, 'processing').subscribe(result => {
      expect(result).toBe(true);
      
      service.getOrderById(1).subscribe(order => {
        expect(order?.status).toBe('processing');
        expect(order?.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');
        done();
      });
    });
  });

  it('should return false when updating non-existent order', (done) => {
    const mockOrders: Order[] = [];

    const loadReq = httpMock.expectOne('/assets/data/orders.json');
    loadReq.flush(mockOrders);

    service.updateOrderStatus(999, 'processing').subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should handle HTTP errors gracefully', () => {
    const req = httpMock.expectOne('/assets/data/orders.json');
    req.error(new ErrorEvent('Network error'));

    // Service should still be created
    expect(service).toBeTruthy();
  });
});
