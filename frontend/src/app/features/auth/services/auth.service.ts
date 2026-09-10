import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, SingInRequest } from './auth.model';

const STORAGE_KEY = 'auth.token';

interface UserResponse {
  email: string;
  userId: string;
  name: string;
}
@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/auth';

  private readonly token = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  readonly me = httpResource<UserResponse>(() => (this.isAuthenticated() ? `${this.apiUrl}/me` : undefined));

  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly currentToken = this.token.asReadonly();

  signIn(credentials: SingInRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(({ token }: LoginResponse) => {
        localStorage.setItem(STORAGE_KEY, token);
        this.token.set(token); // atualiza o signal → isAuthenticated() reage na hora
      }),
      catchError((err: HttpErrorResponse) => {
        const message = err.status === 401 ? 'Credenciais inválidas' : 'Erro no servidor';
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.token.set(null);
  }
}
