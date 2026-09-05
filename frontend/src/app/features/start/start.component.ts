import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { AuthService } from '../auth/services/auth.service';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  private readonly authService = inject(AuthService);
  isXiaomiBrowser = /MiuiBrowser/i.test(navigator.userAgent);
  isSafariOnIphone = navigator.userAgent.includes('iPhone') && navigator.userAgent.includes('Safari');

  isAuthenticated = this.authService.isAuthenticated();
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['registrar']);
    }
  }

  goToRegister() {
    this.router.navigate(['criar-conta']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
