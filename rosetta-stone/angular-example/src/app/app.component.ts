import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { viz } from './viz';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('containerRef')
  containerRef!: ElementRef<HTMLDivElement>;

  private state: Record<string, any> = {};

  private setStateWrapper = (
    updaterFn: (
      prevState: Record<string, any>,
    ) => Record<string, any>,
  ) => {
    this.ngZone.runOutsideAngular(() => {
      this.state = updaterFn(this.state);
      if (this.containerRef?.nativeElement) {
        viz(this.containerRef.nativeElement, {
          state: this.state,
          setState: this.setStateWrapper,
        });
      }
    });
    this.cdr.detectChanges();
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    const container = this.containerRef.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      viz(container, {
        state: this.state,
        setState: this.setStateWrapper,
      });
    });
    this.cdr.detectChanges();
  }
}
