import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list';
import { CartService } from '../../services/cart.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [CartService, provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add product to cart when onAddToCart is called', () => {
    const cartService = TestBed.inject(CartService);
    const spy = spyOn(cartService, 'addToCart');
    
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test',
      price: 99.99,
      category_id: 1,
      image_url: 'test.jpg',
      download_url: 'test.zip'
    };

    component.onAddToCart(mockProduct);
    expect(spy).toHaveBeenCalledWith(mockProduct);
  });
});
