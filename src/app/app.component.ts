import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { LocationService } from './location.service';
import { AuthService } from './auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isLoading = false;
  isAuthenticated = false;
  username = '';
  user: any = null;

  constructor(
    private locationService: LocationService,
    private auth: AuthService,
    private zone: NgZone
  ) {
    this.locationService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.auth.user.subscribe((user) => {
      this.zone.run(() => {
        console.log('user:', user);
        this.user = user;
        this.username = this.user?.attributes?.email;
        this.isAuthenticated = !!user;
      });
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
