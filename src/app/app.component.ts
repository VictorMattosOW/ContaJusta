import { Component, OnInit } from '@angular/core';
import { SessionService } from './shared/services/session.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'contaJusta';
  bgColor = '';

  constructor(private session: SessionService) {}
  ngOnInit(): void {
    this.session.getBackgroundColor().subscribe({
      next: (bg) => {
        this.bgColor = bg;
      }
    });
  }
}
