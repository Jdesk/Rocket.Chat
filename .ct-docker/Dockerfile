FROM rocketchat/base:8
#FROM jshimko/meteor-launchpad:latest
RUN useradd -ms /bin/bash rocketchat || true


ENV RC_VERSION 0.63.0-develop
#RUN curl https://install.meteor.com/ | sh
#RUN   cp "/tmp/.meteor/packages/meteor-tool/1.6.1/mt-os.linux.x86_64/scripts/admin/launch-meteor" /usr/bin/meteor
MAINTAINER buildmaster@rocket.chat

ADD . /app
WORKDIR /app
RUN rm -fr node_modules
#RUN meteor npm install
#RUN set +e \ 
#&& meteor add rocketchat:lib \
#&& set -e

#RUN meteor build --server-only --directory /app

RUN set -x \
 && cd /app/bundle/programs/server \
 && rm -fr node_modules \
 && npm install \
 && npm cache clear --force \
 && chown -R rocketchat:rocketchat /app



VOLUME /app/uploads

WORKDIR /app/bundle
#USER rocketchat
# needs a mongoinstance - defaults to container linking with alias 'mongo'
ENV DEPLOY_METHOD=docker \
    NODE_ENV=production \
    MONGO_URL=mongodb://mongo:27017/rocketchat \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

EXPOSE 3000

CMD ["node", "main.js"]
