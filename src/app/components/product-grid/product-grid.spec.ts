import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductGridComponent } from './product-grid';
import { CartService } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';

describe('ProductGridComponent', () => {
  let component: ProductGridComponent;
  let fixture: ComponentFixture<ProductGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGridComponent, HttpClientTestingModule],
      providers: [CartService, TranslationService, provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGridComponent);
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
