import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.marriage',
  appName: 'Melissa & Matheus',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      showSpinner: false,
      AndroidSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '266710469587-u5nmr1cb1mg472b6tme65ql9h2ee1ns5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
