### Process for Securely Managing App Store Signing Certificates

1. Generate a certificate signing request using Keychain Assistant
2. Create the desired certificate using the CSR generated in Step 1
3. Download and install the certificate locally
4. Find the certificate in Keychain Assistant and export the private keys as a .p12 file
5. Enter a secure password (min 18 chars, 1 uppercase, 1 special char) when prompted by Keychain Assistant
6. Save the password you entered in Passbolt naming it: {BL-project-code}/{Project-name}/{Certificate Name} e.g: BL888/FooProject/DistributionCertificate
7. Share the password you created in Passbolt with the project group
8. Save the certificate (.cer) and private key (.p12) in Dropbox in the path /{Project Directory}/Certificates/Apple/
9. (optional) If sharing with an external entity, use Signal App to send password, then delete message when counterparty confirms receiving the message 

