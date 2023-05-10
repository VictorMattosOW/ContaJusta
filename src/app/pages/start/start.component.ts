import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements AfterViewInit {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sessionService.setBackgroundColor('blue');
    });
  }

  goToUserRegister() {
    this.router.navigate(['userRegistration']);
  }

}
