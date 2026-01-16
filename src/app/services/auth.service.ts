import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // First try to get users from localStorage, fallback to JSON file
    let storedUsers: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      storedUsers = localStorage.getItem('users');
    }
    let usersSource = this.http.get<User[]>('/assets/data/users.json');

    if (storedUsers) {
      usersSource = of(JSON.parse(storedUsers));
    }

    return usersSource.pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  register(userData: { username: string; email: string; password: string }): Observable<boolean> {
    return this.http.get<User[]>('/assets/data/users.json').pipe(
      map(users => {
        const newUser: User = {
          id: users.length + 1,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          firstName: '',
          lastName: '',
          address: '',
          phone: ''
        };
        users.push(newUser);
        // In a real app, you'd save to backend, but for mock, we'll just set as logged in
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          // Save updated users list to localStorage for persistence
          localStorage.setItem('users', JSON.stringify(users));
        }
        this.currentUserSubject.next(newUser);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserProfile(userData: Partial<Omit<User, 'id' | 'password'>>): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return of(false);

    // First try to get users from localStorage, fallback to JSON file
    let storedUsers: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      storedUsers = localStorage.getItem('users');
    }
    let usersSource = this.http.get<User[]>('/assets/data/users.json');

    if (storedUsers) {
      usersSource = of(JSON.parse(storedUsers));
    }

    return usersSource.pipe(
      map(users => {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...userData };
          const updatedUser = users[userIndex];
          this.currentUserSubject.next(updatedUser);
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            // Save updated users list to localStorage for persistence
            localStorage.setItem('users', JSON.stringify(users));
          }
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}