#!/bin/bash
set -x
set -euvo pipefail
IFS=$'\n\t'

# Requires Node.js version 4.x
# Do not run as root
TOOL_NODE_FLAGS="--max-old-space-size=8192"
DEPLOY_DIR=/app
meteor reset
### BUILD
meteor npm install

# on the very first build, meteor build command should fail due to a bug on emojione package (related to phantomjs installation)
# the command below forces the error to happen before build command (not needed on subsequent builds)
set +e
meteor add rocketchat:lib
set -e

meteor build --server-only --directory $DEPLOY_DIR

### RUN
cd $DEPLOY_DIR/bundle/programs/server
npm install

cd $DEPLOY_DIR/bundle

