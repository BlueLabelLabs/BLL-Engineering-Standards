# Blue Label Labs - API Design Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

### 1. All custom APIs developed **must** be developed alongside a Postman Collection 
- For every API developed, there **must** also be a Postman collection created with the definitions for each of the API methods.
- The Postman collection **must** be created within a Workspace setup under the Blue Label Labs orgnanization.
- The Postman collection should be sufficiently paramerterized through the use of environment variables contained within environment files. Each collection **must** be accompanied by 2 environment files, one containing parameters for the Sandbox environment and the other containing parameters for the Production environment.

### 2. All APIs must be properly documented within the Postman Collection mentioned above.
- Postman allows for the creation of inline documentation alongside each method added to a Collection.
- Each method must have proper documentation created in Postman including the following information:
    - Parameter descriptions
    - Parameter types
    - Brief method description
    - Return type and description
    - Error codes returned.
- Postman documentation **must** not be publically accessible and only visibile within the Postman Workspace, unless explcitily requested.
### 3. All APIs **must** adhere to standard HTTP method semantics, where applicable:
-   GET - **Must** only be used when accessing or retrieving  resource.
-   POST - **Must** be used when modifying a resource.
-   PUT - **Optional** can be used in conjunction with POST methods to signify a write that replaces an entire object. In the use of a PUT, the POST methods **must** be used to signify a partial replacement of the contents of the remote resource.

### 4. HTTP Response Codes and API Error Responses
- All API must return proper HTTP response codes for success and error conditions. If the processing of a request results in an error, the API **must not** return an HTTP 200. 
- The following HTTP response codes should be utilized in general:
    - 200: Returned whenever a the API operation completed successfully.
    - 400: It is sent when the client sends a request that doesn’t conform to the expected format at the server end. For example, if the client sent an 
invalid parameter as a part of the POST request, a response with this status code can be sent
    - 401: If the client sent an invalid username/password credentials as a part of the request, this status code will be sent as a part of the response to inform the client about authorization failure. Upon receiving a 401, the app front-end **should** display the proper error messaging on the login screen.
    - 403: If the user credentials sent as a part of the request is that of a user who does not have the right to view the information requested, a response with this status code will be sent from the server end.
    - 404: If the resource requested does not exist, then this response code will be used by the server to inform the client about it
    - 500: All other errors during processing **must** return an HTTP 500 error.

#### 4.1 HTTP 500 Error Response Structure
- When a HTTP 500 error is returned it **should** contain a JSON error message structure containing the following fields of data:
    - Error Code: an integer (or string) uniquely representing this error condition.
    - Title: a string describing in brief what the error is. (optional)
    - Description: a full-text description of what the error is.(optional)
- The front end of the app **should** display only the Error Code to the user and **should** use the Error Code to locate a localized string description to display to the user. Only if no localized string is present should the client ever display the Title or Description returned from the server to the user.

### 5. API Versioning & Forced Update
API’s should be versioned and have optional ability to force upgrades on clients
- Each new major revision of the API should be versioned so that only new downloads of the app will point to the new api version, thus allowing backwards compatibility for old versions of the app.
- The API version should be integrated into the URL string for the server app. For example if we are building a server for the FOO project, the URL should look like:
    - https://\<baseurl>/FOO/api/**v12**/Login
- All APIs servicing mobile app clients **must** implement a forced update mechanism to inform mobile clients to update their local app version from newer versions located on the app store. The standard implementation of forced update logic **must** use the central shared BLL Forced Update Component standard built off of Firebase. The documentation for its implementation can be found here: http://bit.ly/BL206-Forced-Update

### 6. Use of AWS API Gateway & Lambda
- Any API which is to be consumed by 3rd party clients, not the mobile app or website being developed by Blue Label Labs, **must** be implemented in AWS Lambda and exposed via AWS API Gateway, with appropriate rate limits and secured through API keys or internal authorization logic.
- All APIs developed within AWS Gateway must also be documented as part of the Postman Collection requirement mentioned above.
