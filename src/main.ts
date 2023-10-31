import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { Amplify } from 'aws-amplify';
import { default as config } from './aws-exports';

const isLocalhost = !!(window.location.hostname === 'localhost');

const [productionRedirectSignIn, localRedirectSignIn] =
  config.oauth.redirectSignIn.split(',');
const [productionRedirectSignOut, localRedirectSignOut] =
  config.oauth.redirectSignOut.split(',');

const updatedAwsConfig = {
  ...config,
  oauth: {
    ...config.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
};

Amplify.configure(updatedAwsConfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
