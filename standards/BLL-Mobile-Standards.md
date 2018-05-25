# Blue Label Labs - Mobile Standards
- Author: Bobby Gill, Dulio Denis
- Version: 1.1
---

### 1. Localization Strings
Use Localization.strings (and the Android equivalent) files for all copy within an app.

All copy in alert messages/UI should be localizable. Do not hard code any strings into source code, everything should be derived from a localization file.
Provide the strings file to the PM so they can proof the strings.

### 2. Crash Reporting
Fabric Crashlytics should be integrated into every build.
- dSyms provided for every new TestFlight build and uploaded to Firebase.

- Use API Key: b53fcf08df9b183b382153735d57a10862fc5348

### 3. App Identifiers
- Every project will need one sandbox and one production identifier.

- Production: \<App Name>
- Sandbox: \<App Name> - Sandbox

### 4. CocoaPods
Use CocoaPods (when available) for integrating 3rd party libraries into iOS apps.

- CocoaPods should be checked into the Git source tree.

### 5. Passwords & Security
Passwords, and any other secure login information, **must** be stored in the iOS Keychain or Android Keystore

- If the Android device does not have a passcode/pin enabled, then encrypt the password data and store into the preferences. Only do this if the passcode/pin isn’t setup and thus Android keystore isn’t available.

Android code should be protected with proguard.
- Ensure code obfuscation is turned on.
