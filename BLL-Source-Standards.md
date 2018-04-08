# Blue Label Labs - Source Code Repository Standards
- Author: Bobby Gill, Dulio Denis
- Version: 1.0
---

## 1.0. **General**

All source code must live in a Git repository 
(either hosted on GitHub or Bitbucket, as per client requirement).

## 2.0 Commits

### 2.1. 

Commits should be done regularly through development. Commits should be done to enclose specific pieces of functionality or bug fixes. Ideally a single commit should only contain one new feature, or one new bug.

### 2.2 

Clear, legible commit messages must be added to every commit done. If fixing a bug or JIRA/Trello issue, reference the Bug ID and the title of the bug being fixed in the commit message. For Trello issues please include a direct link to the Trello issues resolved in this commit.

## 3.0. **Branches**
![](images/branch-example.png?raw=true)

### 3.1 All repositories must have at least 2 branches:

#### 3.1.a. **Master**
Master should be reflect the production version of the code which is currently released in the app store or production environment.

#### 3.1.b. **Sandbox** 
Sandbox is a development branch where all new features and bug fixes are developed within and QA’ed. 

#### 3.1.c. **Additional branches** 
Additional branches for sub-sprints or releases off of Sandbox can be used at the Dev/PMs discretion. For instance if we are working on features for two different sprints simultaneously (ie. D5 Sprint 1 and D5 Sprint 2), then we should create two branches from Sandbox with the names “D5_Sprint_1” and “D5_Sprint_2”). 

### 3.2 **Production Deployment**
Every release to production (app store or web), must be done from the Master branch. All changes in Sandbox should be merged into Master only after QA is complete and we have received the green light to merge to production. If we are releasing from a sprint branch (ie. D5_Sprint_1) we should first merge the D5_Sprint_1 branch into Sandbox and then from Sandbox into Master.

### 3.3. **Tags**
For every release to production (app store or web), add a lightweight **tag** to the commit in master that was used to deploy. This tag should contain the app store or web version that was released from this commit. 

