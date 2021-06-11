### Process for Securely Managing Play Store Signing Keystore

##### Overview: The Engineering Manager is responsible for creating the App Signing Keystore and sharing it with the Developers using the following process:  

1. In Android Studio, select Build > **Generate Signed Bundle or APK**
2. Select Android App Bundle > **Next**
3. Under the Key store path field, select **Create New**
4. In the *Key Store Path* field: enter a name for your keystore file with a .keystore extension 
5. Fill out form fields making sure to note the *Key Store Password*, *Key Password*, and *Key Alias*. Use secure (min 18 chars, 1 uppercase, 1 special char), unique passwords for the *Key Store Password* and *Key Password*  
6. Click **OK** to generate the keystore file 
7. Save the *Key Store Password*  in Passbolt naming it: {BL-project-code}/{Project-name}/AndroidKeyStorePassword e.g: BL888/FooProject/AndroidKeyStorePassword
8. Save the *Key Password*  in Passbolt naming it: {BL-project-code}/{Project-name}/AndroidKeyPassword e.g: BL888/FooProject/AndroidKeyPassword
9. Save the *Key Alias*  in Passbolt naming it: {BL-project-code}/{Project-name}/AndroidKeyAlias e.g: BL888/FooProject/AndroidKeyAlias
10. Share the *Key Store Password*, *Key Password*, and *Key Alias* you created in Passbolt with the project group
11. Save the keystore file (.keystore) in Dropbox in the path /{Project Directory}/Keystores/Google/
12. (optional) If sharing with an external entity, use Signal App to send passwords and alias, then delete message when counterparty confirms receiving the message

