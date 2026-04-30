#!/bin/bash

COMMIT_MSG="${VERCEL_GIT_COMMIT_MESSAGE:-""}"

# Only deploy to Vercel if on the main branch with commit message "ci: release".
if [[ "$BRANCH" == "main" && "$COMMIT_MSG" == "ci: release" ]]; then
  exit 1
fi

exit 0
