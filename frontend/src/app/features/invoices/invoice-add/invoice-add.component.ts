import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ClientService } from '../../../core/services/client.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/invoices" class="back-link">← Retour aux factures</a>
        <h1>🧾 Créer une Facture</h1>
      </div>

      <!-- Affichage de l'erreur -->
      <div *ngIf="errorMessage" class="error-banner animate-shake">
        <div class="error-icon">⚠️</div>
        <div class="error-text">
          <strong>Erreur :</strong> {{ errorMessage }}
        </div>
      </div>

      <div class="form-grid">
        <!-- Section Client -->
        <div class="form-card glass-effect">
          <h3>👤 Information Client</h3>
          <div class="form-group">
            <label>Client</label>
            <select [(ngModel)]="invoice.clientId" name="clientId" required>
              <option [ngValue]="null">Choisir un client...</option>
              <option *ngFor="let client of clients" [ngValue]="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Numéro de Facture</label>
            <input type="text" [(ngModel)]="invoice.invoiceNumber" name="invoiceNumber" placeholder="Ex: FAC-2024-001">
          </div>
        </div>

        <!-- Section Articles -->
        <div class="form-card glass-effect full-width">
          <div class="table-header">
            <h3>📦 Articles / Produits</h3>
            <button type="button" class="btn-add-line" (click)="addLine()">+ Ajouter une ligne</button>
          </div>

          <div class="table-scroll">
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 40%;">Produit</th>
                  <th>Prix Unitaire</th>
                  <th>Quantité</th>
                  <th>Sous-total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of invoice.details; let i = index" class="item-row">
                  <td>
                    <select [(ngModel)]="item.productId" (change)="onProductChange(i)" name="prod-{{i}}">
                      <option [ngValue]="null">Choisir un produit...</option>
                      <option *ngFor="let p of products" [ngValue]="p.id">
                        {{ p.name }} (Stock: {{p.stockQuantity}})
                      </option>
                    </select>
                  </td>
                  <td>
                    <div class="input-with-symbol">
                      <input type="number" [(ngModel)]="item.unitPrice" name="price-{{i}}" (input)="calculateTotals()">
                      <span>€</span>
                    </div>
                  </td>
                  <td>
                    <input type="number" [(ngModel)]="item.quantity" name="qty-{{i}}" (input)="calculateTotals()" min="1">
                  </td>
                  <td class="subtotal-cell">{{ (item.unitPrice * item.quantity) | currency:'EUR' }}</td>
                  <td>
                    <button type="button" class="btn-remove" (click)="removeLine(i)">
                      <span class="trash-icon">🗑️</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="totals-section">
            <div class="total-box">
              <span class="total-label">Total Général</span>
              <span class="total-amount">{{ invoice.totalAmount | currency:'EUR' }}</span>
            </div>
            <button type="button" class="btn-save" (click)="onSubmit()" [disabled]="loading || !isValid()">
              <span *ngIf="!loading">🚀 Générer la Facture</span>
              <span *ngIf="loading" class="spinner"></span>
              <span *ngIf="loading">Traitement...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: white; max-width: 1100px; margin: 0 auto; }
    .header { margin-bottom: 2.5rem; }
    .back-link { color: #60a5fa; text-decoration: none; font-size: 0.9rem; font-weight: 500; display: block; margin-bottom: 0.5rem; transition: 0.2s; }
    .back-link:hover { color: #3b82f6; transform: translateX(-5px); }
    h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.025em; }

    .error-banner { 
      background: rgba(239, 68, 68, 0.15); 
      border: 1px solid rgba(239, 68, 68, 0.3); 
      color: #f87171; 
      padding: 1.25rem; 
      border-radius: 1rem; 
      margin-bottom: 2rem; 
      display: flex; 
      align-items: center; 
      gap: 1rem; 
      backdrop-filter: blur(5px);
    }
    .error-icon { font-size: 1.5rem; }

    .form-grid { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }
    .full-width { grid-column: 1 / -1; }
    
    .form-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    h3 { margin-bottom: 1.5rem; color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }

    .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    label { font-size: 0.8rem; color: #64748b; font-weight: 600; }
    
    input, select { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.75rem; padding: 0.8rem 1rem; color: white; outline: none; transition: 0.2s; font-size: 0.95rem; }
    input:focus, select:focus { border-color: #3b82f6; background: rgba(0, 0, 0, 0.3); }

    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-add-line { background: #10b98120; color: #10b981; border: 1px solid #10b98140; padding: 0.6rem 1.2rem; border-radius: 0.75rem; cursor: pointer; font-weight: 700; font-size: 0.85rem; transition: 0.2s; }
    .btn-add-line:hover { background: #10b98140; border-color: #10b981; }

    .items-table { width: 100%; border-collapse: collapse; }
    .items-table th { text-align: left; padding: 1rem; color: #64748b; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .items-table td { padding: 1rem 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
    
    .input-with-symbol { position: relative; }
    .input-with-symbol span { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; }
    
    .subtotal-cell { font-weight: 800; color: #3b82f6; font-size: 1.1rem; }
    
    .btn-remove { background: rgba(239, 68, 68, 0.1); border: none; padding: 0.6rem; border-radius: 0.5rem; cursor: pointer; transition: 0.2s; }
    .btn-remove:hover { background: #ef4444; }

    .totals-section { margin-top: 3rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 1rem; }
    .total-box { display: flex; flex-direction: column; }
    .total-label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .total-amount { font-size: 2rem; font-weight: 900; color: #10b981; }

    .btn-save { background: #3b82f6; color: white; border: none; padding: 1rem 2.5rem; border-radius: 1rem; font-size: 1rem; font-weight: 800; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 0.75rem; }
    .btn-save:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4); background: #2563eb; }
    .btn-save:disabled { opacity: 0.3; cursor: not-allowed; }

    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
  `]
})
export class InvoiceAddComponent implements OnInit {
  invoice: any = {
    invoiceNumber: '',
    clientId: null,
    totalAmount: 0,
    details: []
  };

  clients: any[] = [];
  products: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private invoiceService: InvoiceService,
    private clientService: ClientService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.clientService.getClients().subscribe({
      next: (res) => this.clients = res.content || res,
      error: () => this.errorMessage = "Impossible de charger les clients."
    });
    this.productService.getProducts().subscribe({
      next: (res) => this.products = Array.isArray(res) ? res : [],
      error: () => this.errorMessage = "Impossible de charger les produits."
    });
    this.addLine();
  }

  addLine() {
    this.invoice.details.push({ productId: null, quantity: 1, unitPrice: 0 });
  }

  removeLine(index: number) {
    if (this.invoice.details.length > 1) {
      this.invoice.details.splice(index, 1);
      this.calculateTotals();
    }
  }

  onProductChange(index: number) {
    const detail = this.invoice.details[index];
    const product = this.products.find(p => p.id === detail.productId);
    if (product) {
      detail.unitPrice = product.price;
      this.calculateTotals();
    }
  }

  calculateTotals() {
    this.invoice.totalAmount = this.invoice.details.reduce((sum: number, item: any) => {
      return sum + (item.unitPrice * (item.quantity || 0));
    }, 0);
  }

  isValid() {
    return this.invoice.clientId && 
           this.invoice.invoiceNumber && 
           this.invoice.details.length > 0 && 
           this.invoice.details.every((d: any) => d.productId && d.quantity > 0);
  }

  onSubmit() {
    if (!this.isValid()) return;

    this.loading = true;
    this.errorMessage = '';

    this.invoiceService.createInvoice(this.invoice).subscribe({
      next: () => {
        this.router.navigate(['/invoices']);
      },
      error: (err) => {
        console.error("Erreur Backend:", err);
        // On récupère le message d'erreur précis du backend
        this.errorMessage = err.error?.message || err.message || "Une erreur est survenue lors de la création.";
        this.loading = false;
      }
    });
  }
}
