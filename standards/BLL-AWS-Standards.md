# Blue Label Labs - AWS Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

## AWS S3 Standards

### 1. All static files and images used within an app our web site MUST be stored on S3, do not store/save any static files directly to the web server files systems.

### 2. All S3 Buckets must be locked down with the appropriate bucket permissions
- All S3 buckets must only allow create/edit/browse/delete permissions to an AWS IAM user account that will be used by the app. Buckets MUST not be accessible for create/edit/browse/delete to unauthenticated users.
- All S3 buckets **must** not allow public browsing, access of files within (except for static content needed for front end websites/clients)
- All S3 buckets **must** not allow public access to files through a URL, even if those files are to be displayed on public, non-authenticated URLs. All access to files stored on S3 **must** be done through the use of pre-signed AWS URLs with a defined a expiry time.



### 3. Create a new AWS IAM User to be used by any app/web site to write/create/delete/browse an S3 bucket
- DO NOT USE THE ROOT IAM USER's TOKEN!
- Create a new IAM User in the AWS Management console, disable the password.
- Make sure any policies or roles are not associated to new IAM User.
 

### 4. AWS tokens MUST NOT be stored in the source code of the front-end app
- **DO NOT** embed the token/token secret into any front-end code, either mobile app or web client.
- All operations which require the use of the token/token secret to access a AWS resource must be proxied through a back end server, which **must** never expose the token/token secret via its API to the client.

## Access Control to AWS Resources

### 1. All production & sandbox EC2 and RDS machines when deployed MUST be IP-restricted on all NON HTTP/HTTPS protocols
- Create 1 Security Group named "SG-EC2-PROD" and use this to secure all production EC2 instances. This SG must only allow non-HTTP/HTTPS protocol access to:
    - Bobby's Public IP address
    - Public IP address of the dev team
    - RDP protocol accesss is allowed from the SG-EC2-SANDBOX SG used to secure Sandbox EC2 resources.

- Create 1 Security Group named "SG-RDS-PROD" and use this secure all production RDS instance. This SG must only allow MSSQL/MYSQL protocol access to:
    - Bobby's Public IP address
    - Public IP address of the dev team
    - The "SG-EC2-PROD" SG used by the EC2 resources that will be access this database

- Similar to the above, we should create 2 SGs for Sandbox which is also IP restricted.

## DNS / Route53 Setup

### 1. All client DNS records should be managed on AWS Route53 DNS system, especially if we are hosting a website under their root domain.
- Route53 **must** be used if plan to route traffic to a root domain through a load balancer using HTTPS. (ie. if we wanted to host the website for https://bluelabellabs.com on AWS behind a load balancer)
- DNS records must be migrated from the DNS nameserver to Route53 using the export/import functionality on both the source domain host and Amazon Route53.
