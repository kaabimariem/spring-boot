import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper">
      <header class="dashboard-header">
        <h1>Dashboard Analytics</h1>
        <div class="user-info">
          <span>Admin</span>
          <div class="avatar">A</div>
        </div>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon revenue">💰</div>
          <div class="stat-content">
            <span class="label">Chiffre d'Affaires</span>
            <h2 class="value">{{ stats.totalRevenue | currency:'EUR' }}</h2>
            <span class="trend up">+12% vs mois dernier</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon invoices">📄</div>
          <div class="stat-content">
            <span class="label">Total Factures</span>
            <h2 class="value">{{ stats.invoiceCount }}</h2>
            <span class="trend up">+5 nouvelles aujourd'hui</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon clients">👥</div>
          <div class="stat-content">
            <span class="label">Clients Actifs</span>
            <h2 class="value">{{ stats.clientCount }}</h2>
            <span class="trend down">-2% ce mois</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon products">📦</div>
          <div class="stat-content">
            <span class="label">Produits en Stock</span>
            <h2 class="value">{{ stats.productCount }}</h2>
            <span class="trend up">+15 nouveaux</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="chart-section glass">
          <h3>Evolution des Ventes</h3>
          <div class="placeholder-chart">
            <!-- Simulated Chart -->
            <div class="bar" style="height: 40%"></div>
            <div class="bar" style="height: 60%"></div>
            <div class="bar" style="height: 80%"></div>
            <div class="bar" style="height: 50%"></div>
            <div class="bar" style="height: 90%"></div>
            <div class="bar" style="height: 70%"></div>
          </div>
        </div>
        <div class="recent-activity glass">
          <h3>Activités Récentes</h3>
          <div class="activity-list">
            <div class="activity-item">
              <div class="dot"></div>
              <p>Nouvelle facture générée pour <strong>Client A</strong></p>
              <span>Il y a 2 min</span>
            </div>
            <div class="activity-item">
              <div class="dot green"></div>
              <p>Stock mis à jour pour <strong>Produit X</strong></p>
              <span>Il y a 15 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      padding: 2rem;
      color: #e2e8f0;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.25rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      transition: transform 0.3s ease;
    }
    .stat-card:hover { transform: translateY(-5px); }
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .revenue { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .invoices { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .clients { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .products { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
    
    .label { color: #94a3b8; font-size: 0.85rem; font-weight: 500; }
    .value { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0; }
    .trend { font-size: 0.75rem; font-weight: 600; }
    .trend.up { color: #10b981; }
    .trend.down { color: #ef4444; }

    .main-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 1.5rem;
    }
    .placeholder-chart {
      height: 200px;
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .bar {
      flex: 1;
      background: linear-gradient(to top, #3b82f6, #60a5fa);
      border-radius: 0.5rem 0.5rem 0 0;
      transition: height 1s ease;
    }
    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: #3b82f6; margin-top: 5px; }
    .dot.green { background: #10b981; }
    .activity-item p { font-size: 0.9rem; margin: 0; }
    .activity-item span { font-size: 0.75rem; color: #64748b; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalRevenue: 0,
    invoiceCount: 0,
    clientCount: 0,
    productCount: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8081/api/v1/invoices/stats').subscribe({
      next: (data: any) => this.stats = data,
      error: () => console.log('Using mockup data')
    });
  }
}
