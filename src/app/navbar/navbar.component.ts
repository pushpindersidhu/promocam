import { Component, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @ViewChild('dropdown') dropdown: any;
  isLoading = false;
  isAuthenticated = false;
  email = '';
  user: any = null;

  constructor(private auth: AuthService, private zone: NgZone) {
    this.auth.user.subscribe((user) => {
      this.zone.run(() => {
        console.log('user:', user);
        this.user = user;
        this.email = this.user?.attributes?.email;
        this.isAuthenticated = !!user;
      });
    });
  }

  async signInWithGoogle() {
    const socialResult = await this.auth.googleSocialSignIn();
    console.log(socialResult);
  }

  async signOut() {
    await this.auth.signOut();
  }

  toggleDropdown() {
    if (this.dropdown) {
      this.dropdown.nativeElement.classList.toggle('hidden');
    }
  }
}
