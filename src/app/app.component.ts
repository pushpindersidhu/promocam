import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { LocationService } from './location.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isLoading = false;

  constructor(private locationService: LocationService, public auth: AuthService) {
    this.locationService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}
}
