# Blue Label Labs - Versioning & Build Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

### 1. Sandbox & Production
Sandbox and production build numbers should always match.

### 2. Visibility
The version number and build number should always be visible in the app somewhere.

### 3. Admin Portals & Web Sites
Admin portals and web sites should also have version and build numbers associated with them.

### 4. Version Detection
The server will have the ability to detect an app client that is out of date and optionally force an upgrade to the latest app client version:
- We will have a [Version] database table with an entry per version with an update flag that can be either        
    - ShouldRequiredUpdate, or
    - MustRequiredUpdate.
- When an app launches, it will make a call to the server's version API and pass the app's current running version. The server will check the [Version] table and flag corresponding to that passed version. 
    - If the value of MustRequiredUpdate == true, then the app will display an alert on screen (with copy indicating the mandatory condition requiring an app update with a link to the App/Play Store) forcing the user to update to the newest version. 
    - If the value of ShouldRequiredUpdate == true, then the app will display an alert on screen (with copy indicating that an update is suggested with a link to the App/Play Store) and allow the user to keep the current version not forcing the update.
