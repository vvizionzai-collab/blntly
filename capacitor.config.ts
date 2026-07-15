import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.blntly.app",
  appName: "BLNTLY",
  webDir: "out",

  // In production the native shell loads the live URL.
  // This gives instant OTA updates without an App Store release.
  // Remove the server block to bundle the web app statically instead.
  server: {
    url: "https://blntly.app",
    cleartext: false,
    androidScheme: "https",
  },

  ios: {
    scheme: "BLNTLY",
    backgroundColor: "#07080b",
    contentInset: "automatic",
    preferredContentMode: "mobile",
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true,
  },

  android: {
    backgroundColor: "#07080b",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#07080b",
      iosSpinnerStyle: "small",
      spinnerColor: "#f43f4f",
      showSpinner: false,
    },
    StatusBar: {
      style: "Dark",
      backgroundColor: "#07080b",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_blntly",
      iconColor: "#f43f4f",
    },
    Camera: {
      // Required for government ID scan at delivery
    },
  },
};

export default config;
