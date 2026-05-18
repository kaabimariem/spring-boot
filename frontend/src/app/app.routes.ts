import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterRequestComponent) },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent) },
      { path: 'products', loadComponent: () => import('./features/products/product-list/product-list.component').then(c => c.ProductListComponent) },
      { path: 'products/new', loadComponent: () => import('./features/products/product-add/product-add.component').then(c => c.ProductAddComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./features/products/product-add/product-add.component').then(c => c.ProductAddComponent) },
      { path: 'clients', loadComponent: () => import('./features/clients/client-list/client-list.component').then(c => c.ClientListComponent) },
      { path: 'clients/new', loadComponent: () => import('./features/clients/client-add/client-add.component').then(c => c.ClientAddComponent) },
      { path: 'clients/edit/:id', loadComponent: () => import('./features/clients/client-add/client-add.component').then(c => c.ClientAddComponent) },
      { path: 'providers', loadComponent: () => import('./features/providers/provider-list/provider-list.component').then(c => c.ProviderListComponent) },
      { path: 'providers/new', loadComponent: () => import('./features/providers/provider-add/provider-add.component').then(c => c.ProviderAddComponent) },
      { path: 'providers/edit/:id', loadComponent: () => import('./features/providers/provider-add/provider-add.component').then(c => c.ProviderAddComponent) },
      { path: 'invoices', loadComponent: () => import('./features/invoices/invoice-list/invoice-list.component').then(c => c.InvoiceListComponent) },
      { path: 'invoices/new', loadComponent: () => import('./features/invoices/invoice-add/invoice-add.component').then(c => c.InvoiceAddComponent) },
      { path: 'invoices/:id', loadComponent: () => import('./features/invoices/invoice-detail/invoice-detail.component').then(c => c.InvoiceDetailComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
