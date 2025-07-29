import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { main } from './viz'; // Imports the D3 visualization logic

@Component({
  selector: 'app-root', // Standard Angular root selector for the main app component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // OnPush strategy means Angular will only run change detection for this component
  // when its inputs change, an event it originated fires, or explicitly requested.
  // This is often beneficial when integrating with third-party libraries like D3
  // that manage their own DOM manipulations.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  // @ViewChild decorator is used to get a reference to the div element in the template
  // marked with #containerRef. We use `static: true` if we need it in ngOnInit,
  // but for AfterViewInit, it's not strictly necessary.
  @ViewChild('containerRef')
  containerRef!: ElementRef<HTMLDivElement>;

  // This object will hold the state for the D3 visualization.
  private state: Record<string, any> = {};

  // Wrapper for the setState function that will be passed to the D3 visualization.
  // It's an arrow function to ensure `this` context is correctly bound.
  private setStateWrapper = (
    updaterFn: (
      prevState: Record<string, any>,
    ) => Record<string, any>,
  ) => {
    // It's often a good practice to run D3 manipulations outside of Angular's zone
    // to prevent Angular from running unnecessary change detection cycles triggered by D3's own events or timers.
    this.ngZone.runOutsideAngular(() => {
      this.state = updaterFn(this.state); // Update the component's state
      // Call the D3 main rendering function with the new state.
      // Ensure the container element is available.
      if (this.containerRef?.nativeElement) {
        main(
          this.containerRef.nativeElement,
          { state: this.state, setState: this.setStateWrapper },
        );
      }
    });
    // After the state is updated and D3 has re-rendered (potentially),
    // we need to tell Angular to check this component and its children for changes,
    // especially if OnPush strategy is used.
    this.cdr.detectChanges(); // or this.cdr.markForCheck() for more targeted updates
  };

  constructor(
    private cdr: ChangeDetectorRef, // ChangeDetectorRef allows us to manually trigger change detection.
    private ngZone: NgZone, // NgZone allows us to run code outside Angular's change detection mechanism.
  ) {}

  ngAfterViewInit(): void {
    // ngAfterViewInit is a lifecycle hook that is called after Angular has fully initialized
    // the component's view. This is the right place to interact with the DOM element.
    const container = this.containerRef.nativeElement;

    // Initial call to render the D3 visualization.
    // Run this initial rendering outside the Angular zone as well.
    this.ngZone.runOutsideAngular(() => {
      main(container, { state: this.state, setState: this.setStateWrapper });
    });
    // Trigger change detection after the initial render.
    this.cdr.detectChanges();
  }
}
