import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SessionService } from './shared/services/session.service';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { pipe, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterOutlet, NgClass]
})
export class AppComponent implements OnInit, OnDestroy{
  private readonly destroy$ = new Subject<void>();
  title = 'contaJusta';
  bgColor = '';

  constructor(private session: SessionService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnInit(): void {
    this.session.getBackgroundColor().pipe(takeUntil(this.destroy$)).subscribe({
      next: (bg) => {
        this.bgColor = bg;
      }
    });
  }
}
