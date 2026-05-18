import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProviderService } from '../../../core/services/provider.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/products" class="back-link">← Retour à l'inventaire</a>
        <h1>📦 {{ isEditMode ? 'Modifier le' : 'Nouveau' }} Produit</h1>
      </div>

      <div class="form-card glass-effect">
        <div *ngIf="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Nom du Produit</label>
              <input type="text" [(ngModel)]="product.name" name="name" required placeholder="Ex: Ordinateur Portable">
            </div>
            
            <div class="form-group">
              <label>Catégorie</label>
              <select [(ngModel)]="product.category" name="category" required>
                <option value="">Sélectionnez une catégorie</option>
                <option value="ELECTRONIQUE">Électronique</option>
                <option value="MOBILIER">Mobilier</option>
                <option value="INFORMATIQUE">Informatique</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>

            <div class="form-group">
              <label>Prix unitaire (€)</label>
              <input type="number" [(ngModel)]="product.price" name="price" required min="0" step="0.01">
            </div>

            <div class="form-group">
              <label>Quantité en Stock</label>
              <input type="number" [(ngModel)]="product.stockQuantity" name="stockQuantity" required min="0">
            </div>

            <div class="form-group">
              <label>Fournisseur</label>
              <select [(ngModel)]="product.providerId" name="providerId">
                <option [value]="null">Aucun fournisseur</option>
                <option *ngFor="let provider of providers" [value]="provider.id">{{ provider.name }}</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea [(ngModel)]="product.description" name="description" rows="3" placeholder="Détails du produit..."></textarea>
            </div>
          </div>

          <div class="actions">
            <button type="button" routerLink="/products" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Enregistrer le Produit') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: white; max-width: 800px; margin: 0 auto; }
    .header { margin-bottom: 2rem; }
    .back-link { color: #3b82f6; text-decoration: none; font-size: 0.9rem; display: block; margin-bottom: 0.5rem; }
    h1 { font-size: 2rem; font-weight: 800; }

    .glass-effect { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; padding: 2.5rem; }
    
    .error-banner { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem; font-size: 0.9rem; text-align: center; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .full-width { grid-column: span 2; }
    
    label { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }
    input, select, textarea { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.75rem; padding: 0.75rem 1rem; color: white; font-size: 1rem; transition: all 0.2s; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6; background: rgba(255, 255, 255, 0.08); }
    option { background: #1e293b; color: white; }

    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    
    .btn-cancel { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 0.75rem 1.5rem; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; }
    .btn-cancel:hover { background: rgba(255, 255, 255, 0.05); color: white; }

    .btn-save { background: #3b82f6; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-save:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ProductAddComponent implements OnInit {
  product: any = { name: '', category: '', price: 0, stockQuantity: 0, description: '', providerId: null };
  providers: any[] = [];
  loading = false;
  errorMessage = '';
  isEditMode = false;
  productId?: number;

  constructor(
    private productService: ProductService, 
    private providerService: ProviderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadProviders();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProviders() {
    this.providerService.getProviders().subscribe({
      next: (data) => {
        this.providers = Array.isArray(data) ? data : [];
      },
      error: (err) => console.error('Erreur chargement fournisseurs', err)
    });
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement produit', err);
        this.errorMessage = "Impossible de charger les données du produit.";
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    const request = this.isEditMode 
      ? this.productService.updateProduct(this.productId!, this.product)
      : this.productService.createProduct(this.product);

    request.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Erreur enregistrement produit', err);
        this.errorMessage = err.error?.message || "Erreur lors de l'enregistrement. Vérifiez les champs.";
        this.loading = false;
      }
    });
  }
}

