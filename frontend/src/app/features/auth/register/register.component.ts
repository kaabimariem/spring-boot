import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Créer un compte</h1>
        <p>Rejoignez la plateforme ERP Mini</p>
        <form (ngSubmit)="onRegister()">
          <div *ngIf="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>
          <div class="form-group">
            <label>Pseudo</label>
            <input type="text" [(ngModel)]="user.username" name="username" required placeholder="Ex: jean_dupont">
          </div>
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" [(ngModel)]="user.firstName" name="firstName" required placeholder="Jean">
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input type="text" [(ngModel)]="user.lastName" name="lastName" required placeholder="Dupont">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="user.email" name="email" required placeholder="jean@example.com">
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="user.password" name="password" required placeholder="••••••••">
          </div>
          <button type="submit">S'inscrire</button>
        </form>
        <div class="footer-links">
          <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-banner { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem; text-align: center; }
    .login-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; }
    .login-card { background: rgba(255, 255, 255, 0.05); padding: 3rem; border-radius: 1.5rem; width: 400px; color: white; }
    h1 { margin-bottom: 0.5rem; }
    p { color: #94a3b8; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; }
    input { width: 100%; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; color: white; }
    button { width: 100%; padding: 1rem; background: #3b82f6; border: none; border-radius: 0.5rem; color: white; font-weight: 700; cursor: pointer; margin-top: 1rem; }
    .footer-links { margin-top: 1.5rem; text-align: center; }
    a { color: #3b82f6; text-decoration: none; }
  `]
})
export class RegisterRequestComponent {
  user = { username: '', email: '', password: '', firstName: '', lastName: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || "Erreur d'inscription. Pseudo/Email déjà pris ou données invalides.";
      }
    });
  }
}
