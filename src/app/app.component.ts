import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SessionService } from './shared/services/session.service';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterOutlet, NgClass]
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
