import { Injectable } from '@angular/core';
import { Hub, Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  loading: boolean;

  constructor() {
    this.user = null;
    this.loading = true;

    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signIn') {
        this.getUser();
      }
      if (payload.event === 'signOut') {
        this.user = null;
        this.loading = false;
      }
    });
    this.getUser();
  }

  async getUser() {
    try {
      const token = await Auth.currentAuthenticatedUser();
      this.user = token;
      this.loading = false;
    } catch (err) {
      console.log(err);
      this.user = null;
      this.loading = false;
    }
  }

  async signIn() {
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  }

  async signOut() {
    await Auth.signOut();
  }
}
