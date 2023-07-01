import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements AfterViewInit {
  isXiaomiBrowser = /MiuiBrowser/i.test(navigator.userAgent);
  isSafariOnIphone =
    navigator.userAgent.includes('iPhone') &&
    navigator.userAgent.includes('Safari');

  constructor(private sessionService: SessionService, private router: Router) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sessionService.setBackgroundColor('blue');
    });
  }

  goToRegister() {
    this.router.navigate(['registrar']);
  }
}
