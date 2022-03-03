# Blue Label Labs - Mobile Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

### 1. Localization Strings
Use Localization.strings (and the Android equivalent) files for all copy within an app.

All copy in alert messages/UI should be localizable. Do not hard code any strings into source code, everything should be derived from a localization file.
Provide the strings file to the PM so they can proof the strings.

### 2. Crash Reporting
Firebase Crashlytics should be integrated into every build.
- dSyms provided for every new TestFlight build and uploaded to Firebase.
- All production apps should use Crashlytics and the Firebase configuration files provided by the client.
- Ensure all PMs, Engineering Leads, QA and developers have access to the Crashlytics account.

### 3. App Identifiers
- Every project will need one sandbox and one production identifier.

- Production: \<App Name>
- Sandbox: \<App Name> - Sandbox

### 4. CocoaPods
Use CocoaPods (when available) for integrating 3rd party libraries into iOS apps. Never manually copy and paste a library available as a CocoaPod dependency.

- Please review a CocoaPod library before checking it in. Things to consider are: security vulnerabilities, how close it is to end of life (should not already be warning you that it will be deprecated -- make sure it is still in active development), and usefulness -- a Pod should not be doing something already provided by the mobile SDK.
- CocoaPods **must** be properly integrated into an XCode project, ie. copying the source code from a CocoaPod and pasting it into the app is **never** to be done. They **must** be properly referenced via Podfile and integrated via the "pod install" mechanism.
- CocoaPods MUST be checked into git in its own commit clearly stating the reason why it was added and what it will be used for.
- Podfiles MUST specify the specific version of the cocoapod that the code was built using.
- The version of a Cocoapod used in an app MUST BE updated automatically by the development team if that version of the plugin is deprecated or moved out of support by the 3rd party. (ie. Google Places SDK stopped supporting Version 2.7, we need to make sure across all apps we update our Google Places plugins to the *oldest supported* version)
- Do not check in a pod that is used for local development. For example, a debugging tool name FLEX (https://github.com/FLEXTool/FLEX) is available as a Pod, but will be rejected by Apple due to it being designed for only development use.  

### 5. Passwords & Security
Passwords, and any other secure login information, **must** be stored in the iOS Keychain or Android Keystore
- Access tokens received from web services must also be stored in the keychain and not in UserDefaults.
- If the Android device does not have a passcode/pin enabled, then encrypt the password data and store into the preferences. Only do this if the passcode/pin isn’t setup and thus Android keystore isn’t available.

Android code should be protected with proguard.
- Ensure code obfuscation is turned on.

##### App Signing

- [Process For Securely Managing Play Store Signing Keystores](../processes/BLL-Process-For-Securely-Managing-Play-Store-Signing-Keystores.md)
- [Process For Securely Managing App Store Store Signing Certificates](../processes/BLL-Process-For-Securely-Managing-App-Store-Signing-Certificates.md)

### 6. Handling User Sessions
- When a user logs in to a web service and receives a OAuth access token, this access token **must** be stored within the platform keychain and not in UserDefaults.
- Unless otherwise specified by the client, OAuth access tokens should be set with an expiry time of at least 1 month.
- Whenever a token is expired or is no longer accepted by the web service, the mobile app **must** invalidate the token from the keychain and present the user with the login screen.
- When a user chooses to logout of an app, this should be done by invalidating and deleting the locally stored access token and then optionally a call to the web service to invalidate any push device tokens. In the case where the call to invalidate push token on the web service fails due to an invalid token, the app **must not** display any authentication error to the user.  

### 7. 3rd Party API Keys
API tokens for 3rd party services that are embedded into the source code (Google Places, Crashlytics, etc.) must follow the following guidelines:
- Production apps MUST USE client provided API keys. No app should be released into production using a API KEY created by the development team.
- Verify all Google API keys used are associated with an account that has billing information provided.
- API Keys that grant access to permission to AWS, Azure or other sensitive 3rd party platforms **must not** ever be accessed or downloaded by the app through the API, authenticated or not. All operations requiring the use of these tokens **must** be proxied through the server via an authenticated method.
- Stripe API keys **must not** be downloaded or exposed via API as they are never needed on the front-end side. Instead for all operations that require a Stripe API key, expose an authenticated method on the server and have the server peform these operations for the app. (ie. Adding a payment method)

### 8. Error messaging from API
When a app receives an error from the API it **must** do the following:
- In the case of a HTTP 403 (Unauthorized), the app **must** redirect the user to the login screen.
- In the case of a HTTP 500 (Error), the app **must** use the Error Code returned from the API to find and display a localized string from the app bundle. The app **should not** return the error title/description strings returned from the API.

### 9. Linters
When committing the source code **must** checked for programmatic and stylistic errors using linting.
- In the case of Android the app **must** use [Ktlint](https://github.com/pinterest/ktlint), which tries to capture (reflect) official code style from [kotlinlang.org](https://kotlinlang.org/docs/reference/coding-conventions.html) and [Android Kotlin Style Guide](https://android.github.io/kotlin-guides/style.html).
- When implementing linting to an Android project it **must** also include a [pre-commit linting](../processes/BLL-Process-For-Pre-Commit-Linting-On-Android.md) to ensure that the source code pushed to the repository has no programmatic and stylistic errors.
