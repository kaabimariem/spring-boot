import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>📦 Gestion des Produits</h1>
          <p>Consultez et gérez votre inventaire</p>
        </div>
        <button class="btn-primary" routerLink="/products/new">+ Nouveau Produit</button>
      </div>

      <div class="filters-bar glass">
        <div class="search-box">
          <input type="text" [(ngModel)]="searchTerm" placeholder="Rechercher..." (input)="onSearch()">
        </div>
        <div class="sort-box">
          <select [(ngModel)]="sortDir" (change)="loadProducts()">
            <option value="asc">Prix Croissant</option>
            <option value="desc">Prix Décroissant</option>
          </select>
        </div>
      </div>

      <div class="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Fournisseur</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td><strong>{{ product.name }}</strong></td>
              <td><span class="badge">{{ product.category }}</span></td>
              <td>
                <span class="provider-tag" *ngIf="product.providerName">🏢 {{ product.providerName }}</span>
                <span class="no-provider" *ngIf="!product.providerName">-</span>
              </td>
              <td>{{ product.price | currency:'EUR' }}</td>
              <td>
                <span class="stock-status" [class.low]="product.stockQuantity < 10">
                  {{ product.stockQuantity }}
                </span>
              </td>
              <td class="actions">
                <button class="action-btn edit" [routerLink]="['/products/edit', product.id]">✏️</button>
                <button class="action-btn delete" (click)="onDelete(product.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; animation: fadeIn 0.5s ease-out; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: white; font-weight: 800; margin-bottom: 0.25rem; }
    p { color: #94a3b8; }
    
    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1.25rem; }
    
    .filters-bar { padding: 1.5rem; margin-bottom: 1.5rem; display: flex; gap: 1.5rem; }
    .search-box input, .sort-box select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      outline: none;
      width: 100%;
    }

    .table-container { overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 1.25rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
    td { padding: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: white; }
    
    .badge { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 700; }
    .stock-status { font-weight: 700; color: #10b981; }
    .stock-status.low { color: #ef4444; }

    .provider-tag { background: rgba(139, 92, 246, 0.1); color: #a78bfa; padding: 0.3rem 0.7rem; border-radius: 0.75rem; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(139, 92, 246, 0.2); }
    .no-provider { color: #64748b; font-style: italic; font-size: 0.85rem; }

    .btn-primary { background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }

    .action-btn { background: transparent; border: none; cursor: pointer; font-size: 1.1rem; padding: 0.5rem; border-radius: 0.5rem; transition: all 0.2s; }
    .action-btn:hover { background: rgba(255, 255, 255, 0.1); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm = '';
  sortDir = 'asc';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        let list = Array.isArray(res) ? res : [];
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          list = list.filter((p: any) =>
            p.name?.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term)
          );
        }
        this.products = list.sort((a: any, b: any) =>
          this.sortDir === 'asc' ? a.price - b.price : b.price - a.price
        );
      },
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  onSearch() {
    this.loadProducts();
  }

  onDelete(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}
