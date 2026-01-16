import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, ProductInterface } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', (done) => {
    const mockProducts: ProductInterface[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        category_id: 1,
        image_url: 'image1.jpg',
        download_url: 'download1.zip'
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 149.99,
        category_id: 2,
        image_url: 'image2.jpg',
        download_url: 'download2.zip'
      }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Product 1');
      expect(products[1].name).toBe('Product 2');
      done();
    });

    const req = httpMock.expectOne('assets/data/products.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should return empty array on error', (done) => {
    service.getProducts().subscribe(products => {
      expect(products).toEqual([]);
      done();
    });

    const req = httpMock.expectOne('assets/data/products.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should filter products by category', (done) => {
    const mockProducts: ProductInterface[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        category_id: 1,
        image_url: 'image1.jpg',
        download_url: 'download1.zip'
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 149.99,
        category_id: 2,
        image_url: 'image2.jpg',
        download_url: 'download2.zip'
      },
      {
        id: 3,
        name: 'Product 3',
        description: 'Description 3',
        price: 199.99,
        category_id: 1,
        image_url: 'image3.jpg',
        download_url: 'download3.zip'
      }
    ];

    service.getProductsByCategory(1).subscribe(products => {
      expect(products.length).toBe(2);
      expect(products.every(p => p.category_id === 1)).toBe(true);
      done();
    });

    const req = httpMock.expectOne('assets/data/products.json');
    req.flush(mockProducts);
  });

  it('should return empty array when no products match category', (done) => {
    const mockProducts: ProductInterface[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        category_id: 1,
        image_url: 'image1.jpg',
        download_url: 'download1.zip'
      }
    ];

    service.getProductsByCategory(999).subscribe(products => {
      expect(products.length).toBe(0);
      done();
    });

    const req = httpMock.expectOne('assets/data/products.json');
    req.flush(mockProducts);
  });

  it('should handle error when filtering by category', (done) => {
    service.getProductsByCategory(1).subscribe(products => {
      expect(products).toEqual([]);
      done();
    });

    const req = httpMock.expectOne('assets/data/products.json');
    req.error(new ErrorEvent('Network error'));
  });
});
