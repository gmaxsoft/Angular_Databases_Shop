import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header';
import { FooterComponent } from './footer/footer';
import { SidebarComponent } from './sidebar/sidebar';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home').then(c => c.HomeComponent) },
  { path: 'category/:id', loadComponent: () => import('./category/category').then(c => c.CategoryComponent) },
  { path: 'products', loadComponent: () => import('./products/products').then(c => c.ProductsComponent) },
  { path: 'products/category/:id', loadComponent: () => import('./products/products').then(c => c.ProductsComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart').then(c => c.Cart) },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout').then(c => c.CheckoutComponent) },
  { path: 'about', loadComponent: () => import('./about/about').then(c => c.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(c => c.ContactComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(c => c.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./components/user-profile/user-profile').then(c => c.UserProfile) },
  { path: 'user-panel', loadComponent: () => import('./components/user-panel/user-panel').then(c => c.UserPanelComponent) },
  { path: 'user-panel/orders/:id', loadComponent: () => import('./components/order-details/order-details').then(c => c.OrderDetailsComponent) },
  { path: '**', redirectTo: '/home' }
];
