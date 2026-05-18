import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <div class="logo-icon">🚀</div>
          <h1>ERP Mini</h1>
          <p>Gestion Commerciale Professionnelle</p>
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Utilisateur</label>
            <input type="text" [(ngModel)]="credentials.username" name="username" required placeholder="Entrez votre pseudo">
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" [(ngModel)]="credentials.password" name="password" required placeholder="••••••••">
          </div>
          <button type="submit" [disabled]="loading">
            <span *ngIf="!loading">Se connecter</span>
            <span *ngIf="loading">Connexion...</span>
          </button>
        </form>
        <div class="footer-links">
          <p>Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      font-family: 'Inter', sans-serif;
    }
    .login-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem;
      border-radius: 1.5rem;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .logo-section {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .logo-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    h1 {
      color: white;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      color: #e2e8f0;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 0.8rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      color: white;
      transition: all 0.3s ease;
    }
    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
    button {
      width: 100%;
      padding: 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;
      margin-top: 1rem;
    }
    button:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .footer-links {
      text-align: center;
      margin-top: 2rem;
    }
    .footer-links a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        alert('Erreur de connexion');
        this.loading = false;
      }
    });
  }
}
