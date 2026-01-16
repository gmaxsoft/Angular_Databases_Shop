import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
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

  it('should login successfully with correct credentials', (done) => {
    const mockUsers = [
      { id: 1, username: 'testuser', email: 'test@test.com', password: 'password123' }
    ];

    service.login('testuser', 'password123').subscribe(result => {
      expect(result).toBe(true);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getCurrentUser()?.username).toBe('testuser');
      done();
    });

    const req = httpMock.expectOne('/assets/data/users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fail login with incorrect credentials', (done) => {
    const mockUsers = [
      { id: 1, username: 'testuser', email: 'test@test.com', password: 'password123' }
    ];

    service.login('testuser', 'wrongpassword').subscribe(result => {
      expect(result).toBe(false);
      expect(service.isLoggedIn()).toBe(false);
      done();
    });

    const req = httpMock.expectOne('/assets/data/users.json');
    req.flush(mockUsers);
  });

  it('should register new user successfully', (done) => {
    const mockUsers: any[] = [];

    service.register({
      username: 'newuser',
      email: 'new@test.com',
      password: 'password123'
    }).subscribe(result => {
      expect(result).toBe(true);
      expect(service.isLoggedIn()).toBe(true);
      const currentUser = service.getCurrentUser();
      expect(currentUser?.username).toBe('newuser');
      expect(currentUser?.email).toBe('new@test.com');
      done();
    });

    const req = httpMock.expectOne('/assets/data/users.json');
    req.flush(mockUsers);
  });

  it('should logout user', () => {
    const mockUsers = [
      { id: 1, username: 'testuser', email: 'test@test.com', password: 'password123' }
    ];

    service.login('testuser', 'password123').subscribe();
    const req = httpMock.expectOne('/assets/data/users.json');
    req.flush(mockUsers);

    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should update user profile', (done) => {
    const mockUsers = [
      { id: 1, username: 'testuser', email: 'test@test.com', password: 'password123', firstName: '', lastName: '', address: '', phone: '' }
    ];

    // Login first
    service.login('testuser', 'password123').subscribe();
    const loginReq = httpMock.expectOne('/assets/data/users.json');
    loginReq.flush(mockUsers);

    // Update profile
    service.updateUserProfile({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com'
    }).subscribe(result => {
      expect(result).toBe(true);
      const currentUser = service.getCurrentUser();
      expect(currentUser?.firstName).toBe('John');
      expect(currentUser?.lastName).toBe('Doe');
      expect(currentUser?.email).toBe('john@test.com');
      done();
    });

    const updateReq = httpMock.expectOne('/assets/data/users.json');
    updateReq.flush(mockUsers);
  });

  it('should return false when updating profile without being logged in', (done) => {
    service.updateUserProfile({
      firstName: 'John'
    }).subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should handle HTTP errors gracefully', (done) => {
    service.login('testuser', 'password123').subscribe(result => {
      expect(result).toBe(false);
      done();
    });

    const req = httpMock.expectOne('/assets/data/users.json');
    req.error(new ErrorEvent('Network error'));
  });
});
