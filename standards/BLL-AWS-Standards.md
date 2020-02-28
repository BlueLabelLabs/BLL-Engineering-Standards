# Blue Label Labs - AWS Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

## AWS S3 Standards

### 1. All static files and images used within an app our web site MUST be stored on S3, do not store/save any static files directly to the web server files systems.

### 2. All S3 Buckets must be locked down with the appropriate bucket permissions
- All S3 buckets must only allow create/edit/browse/delete permissions to an AWS IAM user account that will be used by the app. Buckets MUST not be accessible for create/edit/browse/delete to unauthenticated users.
- It is generally ok, unless requested by the client or PM team, to allow bucket items to be read without a IAM user account.
- Use the following bucket policy for all S3 buckets, this will enable public read while restricting write/edit/create/delete to a specific IAM user account. (Public Read Private Write)
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "NotPrincipal": {
                "AWS": "arn:aws:iam::905588271239:user/AWS_S3_User"
            },
            "NotAction": "s3:GetObject",
            "Resource": "arn:aws:s3:::S3_Folder/*"
        },
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::905588271239:user/AWS_S3_User"
            },
            "Action": [
                "s3:PutObject",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::S3_Folder/*"
        }
    ]
}
- Note: Add "DeleteObject" Action only when Application demands Delete permission for IAM User.


### 3. Create a new AWS IAM User to be used by any app/web site to write/create/delete/browse an S3 bucket
- DO NOT USE THE ROOT IAM USER's TOKEN!
- Create a new IAM User in the AWS Management console, disable the password.
- Make sure any policies or roles are not associated to new IAM User.
- Embed the token/token secret for the above created account into the app for use in accessing S3 resources.

### 4. AWS tokens MUST NOT be stored in the source code of the front-end app
- Retrieve the tokens to be using on the client side through an authenticated call made to the backend web service. The source code should never have hard coded AWS token or token secrets contained within.

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
