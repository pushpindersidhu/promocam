import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { LocationService } from './location.service';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isLoading = false;
  isAuthenticated = false;

  constructor(
    private locationService: LocationService,
    private auth: AuthService
  ) {
    this.locationService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.auth.authState.subscribe((authState) => {
      this.isAuthenticated = authState === AuthService.SIGN_IN;
    });
  }

  async signInWithGoogle() {
    const socialResult = await this.auth.googleSocialSignIn();
    console.log('google Result:', socialResult);
  }

  async signOut() {
    await this.auth.signOut();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}
}
