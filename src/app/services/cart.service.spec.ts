import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { ProductService, ProductInterface } from './product';

describe('CartService', () => {
  let service: CartService;
  let mockProduct: ProductInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(CartService);
    
    mockProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category_id: 1,
      image_url: 'test.jpg',
      download_url: 'download.zip'
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', (done) => {
    service.addToCart(mockProduct);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(mockProduct.id);
      expect(items[0].quantity).toBe(1);
      done();
    });
  });

  it('should increment quantity when adding same product twice', (done) => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
      done();
    });
  });

  it('should remove product from cart', (done) => {
    service.addToCart(mockProduct);
    service.removeFromCart(mockProduct.id);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should update product quantity', (done) => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 5);
    
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(5);
      done();
    });
  });

  it('should remove product when quantity is set to 0', (done) => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 0);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should calculate total price correctly', (done) => {
    const product2: ProductInterface = {
      ...mockProduct,
      id: 2,
      price: 50.00
    };
    
    service.addToCart(mockProduct);
    service.addToCart(product2);
    service.updateQuantity(mockProduct.id, 2);
    
    service.getTotalPrice().subscribe(total => {
      expect(total).toBe(99.99 * 2 + 50.00);
      done();
    });
  });

  it('should calculate cart item count correctly', (done) => {
    const product2: ProductInterface = {
      ...mockProduct,
      id: 2
    };
    
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    service.addToCart(product2);
    
    service.getCartItemCount().subscribe(count => {
      expect(count).toBe(3);
      done();
    });
  });

  it('should clear cart', (done) => {
    service.addToCart(mockProduct);
    service.clearCart();
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should handle multiple different products', (done) => {
    const product2: ProductInterface = {
      ...mockProduct,
      id: 2,
      name: 'Product 2'
    };
    const product3: ProductInterface = {
      ...mockProduct,
      id: 3,
      name: 'Product 3'
    };
    
    service.addToCart(mockProduct);
    service.addToCart(product2);
    service.addToCart(product3);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(3);
      done();
    });
  });
});
