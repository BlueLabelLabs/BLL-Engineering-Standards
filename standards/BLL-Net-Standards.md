# Blue Label Labs - .Net Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

All new projects leveraging .NET **must** be built using .NET Core 3.0+. We are fully deprecating our use of .NET Framework. 

All new projects **must** not use any Windows Service components. Instead, all batch or timed jobs **must** use AWS Lambda (or Azure equivalent) serverless functions for implementation.

### 1. Usage of References
Always add references via Nuget, **do not** add DLLs directly as references to the project.

### 2. OAuth
Authentication should be done using OAuth bearer tokens using ASP.NET's OWIN infrastructure. For both web services and MVC portals.

### 3. Error Logging & Tracing
Web portals should all have Elmah error logging integration enabled.

All tracing within code **must** be done using the System.Diagnostics trace facility. **DO NOT** under any circumstance manually open filestreams and output your log statements to that. 

### 5. Portal Versioning
Web portals should also have version numbers that are properly incremented and kept track of in the git repository. These version numbers should be visible somewhere in the web portal.

### 6. Static Content
All images or user uploaded static content **must** be stored on Amazon S3 (or equivalent). Do not store images on the application server.
- Bucket policy must be configured so that we **disable** all public access to the bucket and the files within, except for static images/resources needed for the running of front end web sites and clients.
- All access to content within S3 **must** be done through the use of pre-signed URLs with a defined time limit/expiry time. Under no circumstance should we allow direct, public access to images/files (except for those listed in the previous point) in an S3 bucket. 

### 7. Password Hashing and Salting
- There should be no need to store passwords in the database if you are using ASP.NET OWIN's infrastructure, which you should be, it handles the password storage on its own. However, if you must store passwords on the server:
- Passwords saved into the database **must** be salted using a random string generated using the System.Security.Cryptography.RNGCryptoServiceProvider (http://msdn.microsoft.com/en-us/library/system.security.cryptography.rngcryptoserviceprovider.aspx) . The salt should be pre-pended to the password before it is hashed. 
- There **must** be a unique salt for each password in the database. Salts **must** not be reused, ever.
- DO NOT use MD5 to compute a password hash, it is not secure. All passwords must be hashed with either bcrypt (https://github.com/BcryptNet/bcrypt.net) or PBKDF2 algorithms.

### 8. Designing Secure Web Service Operations
- Do not pass in the UserID of the user making the request to the web service method, the web service should use the authentication token and extract the UserID from the token, it should never be accepting the UserID as a parameter to the method.
- Always verify that the UserID has the appropriate permission to perform operations on the target objects of a web service request. For example, in a social networking app, a User should not be able to delete a post that was created by another user. The web service method **must** check that the UserID extracted from the authentication token has the permission to perform the requested operation.
- In methods that return user profile information, if the UserID contained within the authentication token passed **does not** match the UserID of the User information being returned, the web service **must not** return any personal or sensitive information from that User. Fields such as Email, Phone Number, Date of Birth, Address and App preferences **must not** be returned to a caller that is not that user.

### 9. Validation of Email/SMS OTP Codes
- When implementing phone number verification or email verification through the use of OTP codes sent through email/sms, the OTP validation **must** be done on the server and not within the front end app code. That is when a user enters the OTP code, the app *must* call the server to perform the verification check and the server will inform the app if the code is a match. The OTP code *must not* be returned back to the app client or exposed in anywhich way through the web service.

### 10. Change password functionality
- When implementing change password, the verification that the old password matches the password entered by the user **must** be done on the server side. The app should not be storing or comparing the old password to the password entered by the user at all, this **must** be done on the server side.

### 11. Guarding against SQL Injection
- In general, we should avoid using dynamically created SQL statements within our code. We should be using stored procedures or the LINQ object model when possible. However, if using dynamic SQL all parameters to that SQL statement **must** be properly sanitized (using the SqlParameter class for ADO.NET or its equivalent in EntityFramework).
- SQL stored procedures **must never** concatenate user input parameters to a SQL query, simply use a paramerterized query.
     -*WRONG*: SELECT * FROM USER WHERE ID='@userID'.
     -*RIGHT*: write it SELECT * FROM USER WHERE ID=@userID


