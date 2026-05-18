import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = 'http://localhost:8081/api/v1/providers';

  constructor(private http: HttpClient) {}

  getProviders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProviderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProvider(provider: any): Observable<any> {
    return this.http.post(this.apiUrl, provider);
  }

  updateProvider(id: number, provider: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, provider);
  }

  deleteProvider(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
