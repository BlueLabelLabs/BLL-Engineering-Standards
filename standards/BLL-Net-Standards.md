# Blue Label Labs - .Net Standards
- Author: Bobby Gill, Dulio Denis
- Version: 1.0
---

### 1. Usage of References
Always add references via Nuget, **do not** add DLLs directly as references to the project.

### 2. OAuth
Authentication should be done using OAuth bearer tokens using ASP.NET's OWIN infrastructure. For both web services and MVC portals.

### 3. Error Logging
Web portals should all have Elmah error logging integration enabled.

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
