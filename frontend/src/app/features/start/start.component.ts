import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ButtonLinkComponent } from 'app/shared/components/button-link/button-link.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ButtonComponent, ButtonLinkComponent, ButtonLinkComponent],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {
  isXiaomiBrowser = /MiuiBrowser/i.test(navigator.userAgent);
  isSafariOnIphone = navigator.userAgent.includes('iPhone') && navigator.userAgent.includes('Safari');

  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['criar-conta']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
