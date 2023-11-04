import { Injectable } from '@angular/core';
import { Auth, CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Hub, ICredentials } from '@aws-amplify/core';
import { Subject, Observable } from 'rxjs';
import { CognitoUser } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _user: Subject<CognitoUser | null> = new Subject<CognitoUser | null>();
  public user: Observable<CognitoUser | null> = this._user.asObservable();

  constructor() {
    this.checkInitialLoginStatus();

    Hub.listen('auth', async (data) => {
      const { channel, payload } = data;
      if (channel === 'auth') {
        switch (payload.event) {
          case 'signIn':
            const user = await Auth.currentUserInfo();
            this._user.next(user);
            break;
          case 'signUp':
            break;
          case 'signOut':
            this._user.next(null);
            break;
          case 'signIn_failure':
            console.log('user sign in failed');
            break;
          case 'tokenRefresh':
            console.log('token refresh succeeded');
            break;
          case 'tokenRefresh_failure':
            console.log('token refresh failed');
            break;
          case 'configured':
            console.log('the Auth module is configured');
        }
      }
    });
  }

  async checkInitialLoginStatus() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this._user.next(user);
    } catch (error) {
      this._user.next(null);
    }
  }

  async signOut(): Promise<any> {
    await Auth.signOut();
    return this._user.next(null);
  }

  googleSocialSignIn(): Promise<ICredentials> {
    return Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  }
}
