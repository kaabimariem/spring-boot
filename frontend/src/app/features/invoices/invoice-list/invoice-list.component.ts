import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header-section">
        <div>
          <h1>🧾 Factures</h1>
          <p>Suivi de vos ventes et facturation</p>
        </div>
        <button class="btn-add" routerLink="/invoices/new">+ Nouvelle Facture</button>
      </div>

      <div class="table-container glass-effect">
        <table class="modern-table">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant Total</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let invoice of invoices" class="table-row">
              <td class="id-col">{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.clientName }}</td>
              <td>{{ invoice.invoiceDate | date:'dd/MM/yyyy' }}</td>
              <td class="amount-col">{{ invoice.totalAmount | currency:'EUR' }}</td>
              <td class="actions">
                <button class="action-btn view" title="Voir détails" [routerLink]="['/invoices', invoice.id]">👁️</button>
                <button class="action-btn delete" title="Supprimer" (click)="onDelete(invoice.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="invoices.length === 0" class="empty-state">
          <div class="empty-icon">📄</div>
          <p>Aucune facture émise pour le moment.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: white; animation: fadeIn 0.5s ease-out; }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem; }
    p { color: #94a3b8; }
    
    .btn-add { background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-add:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }

    .glass-effect { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.25rem; overflow: hidden; }
    
    .modern-table { width: 100%; border-collapse: collapse; text-align: left; }
    .modern-table th { padding: 1.25rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
    .modern-table td { padding: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    
    .id-col { color: #3b82f6; font-weight: 700; font-family: monospace; }
    .amount-col { font-weight: 800; color: #10b981; }
    
    .actions { text-align: right; }
    .action-btn { background: none; border: none; padding: 0.5rem; cursor: pointer; border-radius: 0.5rem; font-size: 1.1rem; }
    .action-btn:hover { background: rgba(255, 255, 255, 0.1); }

    .empty-state { padding: 4rem; text-align: center; color: #94a3b8; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getInvoices().subscribe({
      next: (res: any) => this.invoices = res.content || res,
      error: (err) => console.error(err)
    });
  }

  onDelete(id: number) {
    if (confirm('Supprimer cette facture ?')) {
      this.invoiceService.deleteInvoice(id).subscribe(() => this.loadInvoices());
    }
  }
}
