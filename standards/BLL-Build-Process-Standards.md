# Blue Label Labs - Build Process & Conventions
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

### 1. Explicitly remove client from all TestFlight and Google Play builds prior to upload
Dev teams should never be uploading a build to TestFlight or Google Play where the client will have access to them unless expressly authorized to do so by their PM. The PM will decide when to add the client to the build when appropriate.

### 2. Release Notes & Unit Tests
- Each build should be accompanied by a Release Notes and Unit Test document. The Release Notes document should clearly outline all new functionality and bugs addressed in this build.
- The Unit Test document should list in a table all of the tests the developer has ran on this build and their outcome. NOTE: The developer must provide meaningful test descriptions for the tests that were ran and the outcomes of those tests. Messages like "Outcome matched conversation on Skype" are not acceptable. A reader should be able to read these documents and surmise what the unit test was and what the outcomes was without outside information.
- All Unit Test and Release Notes should be uploaded to Google Drive or done as a Google Document and Google Sheet. The PM will setup a Google Drive for each project.

### 3. Automated Builds/Continuous Deployment
- All Android and iOS projects **must** be integrated into a Continuous Deployment tool for creating and distributing builds automatically. Please consult with BLL Engineering to get instructions on which tool and how to integrate.
- All backend projects (Node/.NET Core/etc) **must** be integrated into a Continuous Deployment tool for pushing new releases to sandbox and production environments. Please consult with BLL Engineering to get instructions on which tool and how to integrate.


