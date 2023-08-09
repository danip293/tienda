#!/bin/bash
# variables
developBranch='develop'
masterBranch='master'
version=$1
# validate the version pased as param 
if [[ -z $version ]]; then
    echo "You must provide a version" 1>&2
    exit 1
fi
# exit when any command fails
set -egit 

echo Initialzing the scrip with version $version &&

git checkout $developBranch
# git pull origin $developBranch
node ./release.js $version
git add . &&
git commit -m "version: $version"
git tag -a "xdt_$version" -m "version: $version"
# git push origin $developBranch

# merge
git checkout $masterBranch
git merge $developBranch
git push origin $masterBranch




# # merge
# git checkout -b develop origin/develop
# git checkout master
# git merge -Xtheirs --squash develop -m "v${version}"

# # commit
# git commit -m "v${version}"

# # tag
# git tag v${version} -m "v${version}"

# # push
# git push origin v${version}

# GIT_BRANCH_TO_MERGE_FROM=`git symbolic-ref HEAD | sed 's!refs\/heads\/!!'`
# GIT_BRANCH_TO_MERGE_TO="master"

# git checkout "${GIT_BRANCH_TO_MERGE_TO}"
# git checkout "${GIT_BRANCH_TO_MERGE_FROM}"

# # Delete TO branch
# git branch -D "${GIT_BRANCH_TO_MERGE_TO}" || echo "Failed to delete ${GIT_BRANCH_TO_MERGE_TO}"
# git push origin :"${GIT_BRANCH_TO_MERGE_TO}" || echo "Failed to push ${GIT_BRANCH_TO_MERGE_TO} delete to origin"

# # Create TO branch
# git checkout -b "${GIT_BRANCH_TO_MERGE_TO}" || echo "Failed to create local branch ${GIT_BRANCH_TO_MERGE_TO}"
# git push origin "${GIT_BRANCH_TO_MERGE_TO}" || echo "Failed to push ${GIT_BRANCH_TO_MERGE_TO} to origin"

