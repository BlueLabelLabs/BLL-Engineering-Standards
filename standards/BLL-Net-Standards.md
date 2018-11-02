# Blue Label Labs - .Net Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

### 1. Usage of References
Always add references via Nuget, **do not** add DLLs directly as references to the project.

### 2. OAuth
Authentication should be done using OAuth bearer tokens using ASP.NET's OWIN infrastructure. For both web services and MVC portals.

### 3. Error Logging & Tracing
Web portals should all have Elmah error logging integration enabled.

All tracing within code **must** be done using the System.Diagnostics trace facility. **DO NOT** under any circumstance manually open filestreams and output your log statements to that. 

### 4. API Versioning
API’s should be versioned and have optional ability to force upgrades on clients
- Each new major revision of the API should be versioned so that only new downloads of the app will point to the new api version, thus allowing backwards compatibility for old versions of the app.
- The API version should be integrated into the URL string for the server app. For example if we are building a server for the Muncheez project, the URL should look like:
    - https://\<baseurl>/Muncheez/api/**v12**/Login

### 5. Portal Versioning
Web portals should also have version numbers that are properly incremented and kept track of in the git repository. These version numbers should be visible somewhere in the web portal.

### 6. Static Content
All images or user uploaded static content **must** be stored on Amazon S3 (or equivalent). Do not store images on the application server.
- Bucket policy must be configured so that we **disable** direct browsing on the bucket.
- Unless specifically requested by the client, it is ok to allow individual S3 files to be accessible by anyone.

### 7. Password Hashing and Salting
- There should be no need to store passwords in the database if you are using ASP.NET OWIN's infrastructure, which you should be, it handles the password storage on its own. However, if you must store passwords on the server:
- Passwords saved into the database **must** be salted using a random string generated using the System.Security.Cryptography.RNGCryptoServiceProvider (http://msdn.microsoft.com/en-us/library/system.security.cryptography.rngcryptoserviceprovider.aspx) . The salt should be pre-pended to the password before it is hashed. 
- There **must** be a unique salt for each password in the database. Salts **must** not be reused, ever.
- DO NOT use MD5 to compute a password hash, it is not secure. All passwords must be hashed with either bcrypt (https://github.com/BcryptNet/bcrypt.net) or PBKDF2 algorithms.


