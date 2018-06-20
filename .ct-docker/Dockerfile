FROM rocketchat/base:8
#FROM jshimko/meteor-launchpad:latest
#FROM ulexus/meteor:build
RUN apt-get update
RUN apt-get install build-essential -y
RUN apt-get install git -y
RUN apt-get install python -y
RUN apt-get install apt-transport-https -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |  apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" |  tee /etc/apt/sources.list.d/yarn.list
RUN  apt-get update &&  apt-get install yarn -y
RUN useradd -ms /bin/bash rocketchat || true
ENV METEOR_ALLOW_SUPERUSER true
ENV RC_VERSION 0.63.0-develop
RUN curl https://install.meteor.com/ | sh
#RUN   cp "/tmp/.meteor/packages/meteor-tool/1.6.1/mt-os.linux.x86_64/scripts/admin/launch-meteor" /usr/bin/meteor
MAINTAINER buildmaster@rocket.chat
RUN mkdir /app || true

ADD . /app
WORKDIR /app

RUN chmod +x ./ct-build.sh

RUN ./ct-build.sh

VOLUME /app/uploads

WORKDIR /app/bundle

ENV DEPLOY_METHOD=docker \
    NODE_ENV=production \
    MONGO_URL=mongodb://mongo:27017/rocketchat \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

EXPOSE 3000



CMD ["node", "main.js"]
