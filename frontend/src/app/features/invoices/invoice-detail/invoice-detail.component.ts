import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container" *ngIf="invoice">
      <div class="no-print header-nav">
        <a routerLink="/invoices" class="back-link">← Retour à la liste</a>
        <button class="btn-print" (click)="printInvoice()">🖨️ Télécharger / Imprimer la facture</button>
      </div>

      <div class="invoice-paper" id="print-section">
        <!-- En-tête de la facture -->
        <div class="invoice-header">
          <div class="brand">
            <div class="logo">🚀</div>
            <div class="brand-text">
              <h2>ERP Mini</h2>
              <p>Solution de Gestion Intégrée</p>
            </div>
          </div>
          <div class="invoice-info">
            <h1>FACTURE</h1>
            <p class="invoice-num">#{{ invoice.invoiceNumber }}</p>
            <p class="date">Émise le : {{ invoice.invoiceDate | date:'dd/MM/yyyy' }}</p>
          </div>
        </div>

        <hr class="separator">

        <!-- Infos Client et Entreprise -->
        <div class="address-grid">
          <div class="address-block">
            <span class="label">Émetteur</span>
            <p class="name">ERP SYSTEM SARL</p>
            <p>123 Business Street, Tech City</p>
            <p>France</p>
            <p>contact&#64;erp-mini.fr</p>
          </div>
          <div class="address-block text-right">
            <span class="label">Facturé à</span>
            <p class="name">{{ invoice.clientName }}</p>
            <p>Client ID: #{{ invoice.clientId }}</p>
            <p>Détails du compte client vérifiés</p>
          </div>
        </div>

        <!-- Tableau des produits -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Désignation du produit</th>
              <th class="text-right">Prix Unitaire</th>
              <th class="text-center">Quantité</th>
              <th class="text-right">Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of invoice.details">
              <td class="product-name">
                <strong>{{ item.productName }}</strong>
                <span class="sku">Réf: PROD-{{ item.productId }}</span>
              </td>
              <td class="text-right">{{ item.unitPrice | currency:'EUR' }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-right bold">{{ item.subtotal | currency:'EUR' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pied de page avec totaux -->
        <div class="invoice-footer">
          <div class="notes">
            <p class="label">Notes / Conditions</p>
            <p>Paiement dû sous 30 jours. Merci de votre confiance !</p>
          </div>
          <div class="totals">
            <div class="total-row">
              <span>Total Hors Taxes</span>
              <span>{{ invoice.totalAmount | currency:'EUR' }}</span>
            </div>
            <div class="total-row main">
              <span>Net à Payer (EUR)</span>
              <span>{{ invoice.totalAmount | currency:'EUR' }}</span>
            </div>
          </div>
        </div>

        <div class="watermark">PAYÉ</div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .header-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .back-link { color: #60a5fa; text-decoration: none; font-weight: 600; }
    
    .btn-print { 
      background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; 
      border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.3s;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
    }
    .btn-print:hover { background: #2563eb; transform: translateY(-2px); }

    /* Style du Papier Facture */
    .invoice-paper {
      background: white;
      color: #1e293b;
      padding: 4rem;
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .brand { display: flex; gap: 1rem; align-items: center; }
    .logo { font-size: 2.5rem; }
    .brand h2 { font-size: 1.5rem; font-weight: 900; color: #1e293b; margin: 0; }
    .brand p { margin: 0; font-size: 0.85rem; color: #64748b; }

    .invoice-info { text-align: right; }
    .invoice-info h1 { font-size: 2rem; font-weight: 900; color: #3b82f6; margin: 0; letter-spacing: 2px; }
    .invoice-num { font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0; }
    .date { color: #64748b; font-size: 0.9rem; }

    .separator { border: none; border-top: 2px solid #f1f5f9; margin: 2rem 0; }

    .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 3rem; }
    .address-block p { margin: 0.2rem 0; font-size: 0.95rem; }
    .address-block .name { font-weight: 800; font-size: 1.1rem; margin-bottom: 0.5rem; }
    .label { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 0.5rem; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }

    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 3rem; }
    .items-table th { background: #f8fafc; padding: 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #f1f5f9; }
    .items-table td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f5f9; }
    .product-name { display: flex; flex-direction: column; }
    .sku { font-size: 0.75rem; color: #94a3b8; }
    .bold { font-weight: 800; }

    .invoice-footer { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; align-items: flex-start; }
    .notes { background: #f8fafc; padding: 1.5rem; border-radius: 0.75rem; font-size: 0.85rem; border-left: 4px solid #3b82f6; }

    .totals { display: flex; flex-direction: column; gap: 0.5rem; }
    .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.95rem; }
    .total-row.main { border-top: 2px solid #1e293b; margin-top: 0.5rem; padding-top: 1rem; font-weight: 900; font-size: 1.25rem; color: #3b82f6; }

    .watermark { 
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 8rem; font-weight: 900; color: rgba(16, 185, 129, 0.05); pointer-events: none;
    }

    /* Styles pour l'impression */
    @media print {
      /* Masquer TOUT par défaut */
      body, html { background: white !important; color: black !important; }
      
      /* Masquer les éléments de navigation et l'arrière-plan de l'app */
      :host-context(body) app-sidebar, 
      :host-context(body) .sidebar,
      :host-context(body) .header,
      :host-context(body) .nav,
      :host-context(body) .main-layout { 
        display: none !important; 
        width: 0 !important;
        height: 0 !important;
      }

      .no-print { display: none !important; }

      /* Isoler et centrer la facture */
      .page-container { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
      .invoice-paper { 
        box-shadow: none !important; 
        border: none !important; 
        padding: 0 !important;
        width: 100% !important;
        position: static !important;
      }
    }
  `]
})
export class InvoiceDetailComponent implements OnInit {
  invoice: any;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.invoiceService.getInvoice(+id).subscribe({
        next: (res) => this.invoice = res,
        error: (err) => console.error(err)
      });
    }
  }

  printInvoice() {
    window.print();
  }
}
