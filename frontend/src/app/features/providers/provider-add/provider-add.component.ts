import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProviderService } from '../../../core/services/provider.service';

@Component({
  selector: 'app-provider-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/providers" class="back-link">← Retour à la liste</a>
        <h1>{{ isEditMode ? 'Modifier le' : 'Nouveau' }} Fournisseur</h1>
      </div>

      <div class="form-card glass-effect">
        <form (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Nom / Raison Sociale</label>
              <input type="text" [(ngModel)]="provider.name" name="name" required placeholder="Ex: Fournisseur Tech SARL">
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="provider.email" name="email" required placeholder="contact@fournisseur.fr">
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input type="text" [(ngModel)]="provider.phone" name="phone" required placeholder="06 12 34 56 78">
            </div>

            <div class="form-group full-width">
              <label>Adresse</label>
              <textarea [(ngModel)]="provider.address" name="address" rows="3" placeholder="Avenue Mohamed V, Casablanca"></textarea>
            </div>
          </div>

          <div class="actions">
            <button type="button" routerLink="/providers" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Enregistrer le Fournisseur') }}
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
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .full-width { grid-column: span 2; }
    
    label { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }
    input, textarea { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.75rem; padding: 0.75rem 1rem; color: white; font-size: 1rem; transition: all 0.2s; }
    input:focus, textarea:focus { outline: none; border-color: #3b82f6; background: rgba(255, 255, 255, 0.08); }

    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    
    .btn-cancel { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 0.75rem 1.5rem; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; }
    .btn-cancel:hover { background: rgba(255, 255, 255, 0.05); color: white; }

    .btn-save { background: #3b82f6; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-save:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ProviderAddComponent implements OnInit {
  provider: any = { name: '', email: '', phone: '', address: '' };
  loading = false;
  isEditMode = false;
  providerId?: number;

  constructor(
    private providerService: ProviderService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.providerId = +id;
      this.loadProvider(this.providerId);
    }
  }

  loadProvider(id: number) {
    this.loading = true;
    this.providerService.getProviderById(id).subscribe({
      next: (data) => {
        this.provider = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement fournisseur', err);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    
    const request = this.isEditMode 
      ? this.providerService.updateProvider(this.providerId!, this.provider)
      : this.providerService.createProvider(this.provider);

    request.subscribe({
      next: () => {
        this.router.navigate(['/providers']);
      },
      error: (err) => {
        console.error('Erreur enregistrement fournisseur', err);
        this.loading = false;
      }
    });
  }
}
