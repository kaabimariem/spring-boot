import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/clients" class="back-link">← Retour à la liste</a>
        <h1>{{ isEditMode ? 'Modifier le' : 'Nouveau' }} Client</h1>
      </div>

      <div class="form-card glass-effect">
        <form (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Nom Complet</label>
              <input type="text" [(ngModel)]="client.name" name="name" required placeholder="Ex: Entreprise Martin">
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="client.email" name="email" required placeholder="contact@martin.fr">
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input type="text" [(ngModel)]="client.phone" name="phone" required placeholder="01 23 45 67 89">
            </div>

            <div class="form-group full-width">
              <label>Adresse</label>
              <textarea [(ngModel)]="client.address" name="address" rows="3" placeholder="123 Rue de la Paix, 75000 Paris"></textarea>
            </div>
          </div>

          <div class="actions">
            <button type="button" routerLink="/clients" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Enregistrer le Client') }}
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
export class ClientAddComponent implements OnInit {
  client: any = { name: '', email: '', phone: '', address: '' };
  loading = false;
  isEditMode = false;
  clientId?: number;

  constructor(
    private clientService: ClientService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = +id;
      this.loadClient(this.clientId);
    }
  }

  loadClient(id: number) {
    this.loading = true;
    this.clientService.getClientById(id).subscribe({
      next: (data) => {
        this.client = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement client', err);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    
    const request = this.isEditMode 
      ? this.clientService.updateClient(this.clientId!, this.client)
      : this.clientService.createClient(this.client);

    request.subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Erreur enregistrement client', err);
        this.loading = false;
      }
    });
  }
}
