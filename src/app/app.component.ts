import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SessionService } from './shared/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
