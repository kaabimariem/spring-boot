import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderService } from '../../../core/services/provider.service';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header-section">
        <div>
          <h1>🏢 Fournisseurs</h1>
          <p>Gérez votre base de données fournisseurs</p>
        </div>
        <button class="btn-add" routerLink="/providers/new">
          <span class="icon">+</span> Nouveau Fournisseur
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Total Fournisseurs</div>
          <div class="value">{{ providers.length }}</div>
        </div>
      </div>

      <div class="table-container glass-effect">
        <table class="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom Complet</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let provider of providers" class="table-row">
              <td class="id-col">#{{ provider.id }}</td>
              <td class="name-col">
                <div class="avatar">{{ provider.name?.charAt(0) || 'F' }}</div>
                {{ provider.name }}
              </td>
              <td>{{ provider.email }}</td>
              <td>{{ provider.phone }}</td>
              <td class="address-col text-truncate">{{ provider.address }}</td>
              <td class="actions">
                <button class="action-btn edit" title="Modifier" [routerLink]="['/providers/edit', provider.id]">✏️</button>
                <button class="action-btn delete" title="Supprimer" (click)="onDelete(provider.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="providers.length === 0" class="empty-state">
          <div class="empty-icon">📂</div>
          <p>Aucun fournisseur trouvé. Commencez par en ajouter un !</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; color: white; animation: fadeIn 0.5s ease-out; }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem; }
    p { color: #94a3b8; }
    
    .btn-add { background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
    .btn-add:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.1); }
    .stat-card .label { color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .stat-card .value { font-size: 1.5rem; font-weight: 700; }

    .glass-effect { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.25rem; overflow: hidden; }
    
    .modern-table { width: 100%; border-collapse: collapse; text-align: left; }
    .modern-table th { padding: 1.25rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .modern-table td { padding: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    
    .table-row:hover { background: rgba(255, 255, 255, 0.02); }
    
    .name-col { display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }
    .avatar { width: 32px; height: 32px; background: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
    
    .id-col { color: #3b82f6; font-family: monospace; font-weight: 600; }
    .address-col { max-width: 200px; color: #94a3b8; font-size: 0.875rem; }
    
    .actions { text-align: right; }
    .action-btn { background: none; border: none; padding: 0.5rem; cursor: pointer; border-radius: 0.5rem; transition: all 0.2s; }
    .action-btn:hover { background: rgba(255, 255, 255, 0.1); }
    
    .empty-state { padding: 4rem; text-align: center; color: #94a3b8; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProviderListComponent implements OnInit {
  providers: any[] = [];

  constructor(private providerService: ProviderService) {}

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.providerService.getProviders().subscribe({
      next: (res: any) => {
        this.providers = res.content || res;
      },
      error: (err) => {
        console.error('Erreur chargement fournisseurs', err);
      }
    });
  }

  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      this.providerService.deleteProvider(id).subscribe({
        next: () => {
          this.loadProviders();
        },
        error: (err) => {
          console.error('Erreur suppression fournisseur', err);
          alert("Impossible de supprimer le fournisseur. Il est peut-être lié à des produits.");
        }
      });
    }
  }
}
