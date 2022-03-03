### Process for Pre-Commit Linting on Android

##### Overview: The Dev Lead is responsible for creating the pre-commit linting file using the following steps:  

1. Create a the pre-commit at the root of the project
```
#!/bin/bash

git stash -q --keep-index

echo "Running git pre-commit hook"

./gradlew ktlint

RESULT=$?

git stash pop -q

# return 1 exit code if running checks fails
[ $RESULT -ne 0 ] && exit 1
exit 0
```
2. Add installGitHook task to the root `build.gradle`
```
allProjects {
    repositories {
        ...
    }
}
task installGitHook(type: Copy) {
    from new File(rootProject.rootDir, 'pre-commit')
    into { new File(rootProject.rootDir, '.git/hooks') }
    fileMode 0777
}
tasks.getByPath(':app:preBuild').dependsOn installGitHook
```
